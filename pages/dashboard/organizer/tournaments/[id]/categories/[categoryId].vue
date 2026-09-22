<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <div
                            class="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg shrink-0 p-2 overflow-hidden">
                            <img v-if="categoryName" :src="'/' + getCategoryIcon(categoryName)" :alt="categoryName" class="w-full h-full object-contain" />
                            <Icon v-else icon="ph:users" class="text-white text-2xl" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/categories`"
                                        class="text-xs font-bold text-primary hover:underline tracking-widest flex items-center gap-1">
                                        <Icon icon="ph:arrow-left-bold" />
                                        {{ t('event_categories.back_to_categories') }}
                                    </NuxtLink>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                {{ categoryName || t('event_categories.detail_title') }}
                            </h1>
                            <div class="text-slate-300 text-sm max-w-2xl">
                                {{ t('event_categories.category_participants_desc') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Participants Table with Unified Component -->
        <DashboardDataTable
            :items="participants"
            :headers="headers"
            :loading="isLoading"
            :searchable="true"
            :search-placeholder="t('event_categories.search_placeholder', 'Cari nama pemanah, klub, atau ID...')"
            :title="t('event_categories.participants_title')"
            :subtitle="t('event_categories.participants_count_unit', '{count} Pemanah terdaftar', { count: participants.length })"
            :icon="'ph:users-bold'"
            :default-page-size="25"
        >
            <!-- Column Slots -->
            <template #item-no="{ index }">
                <span class="text-sm font-bold text-gray-400">{{ index + 1 }}</span>
            </template>

            <template #item-name="{ item }">
                <div class="flex items-center gap-3">
                    <div
                        class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs border border-gray-200 overflow-hidden shrink-0">
                        <img :src="useImageOrDefault(item.avatar_url, item.full_name)"
                            class="w-full h-full object-cover">
                    </div>
                    <div class="min-w-0">
                        <div class="text-sm font-black text-navy leading-tight">{{ item.full_name }}</div>
                        <div class="text-xs text-gray-400 font-medium mt-1">{{ item.athlete_code || '-' }}</div>
                    </div>
                </div>
            </template>

            <template #item-club_city="{ item }">
                <div class="text-sm font-bold text-navy leading-tight">{{ item.club_name || t('event_categories.independent') }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ item.city || '-' }}</div>
            </template>

            <template #item-payment_status="{ item }">
                <span
                    :class="item.payment_status === 'Terbayar' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tighter">
                    {{ item.payment_status === 'Terbayar' ? t('event_categories.status_paid') : t('event_categories.status_pending') }}
                </span>
            </template>

            <!-- Empty Slot -->
            <template #empty>
                <div class="p-12 text-center">
                    <Icon icon="ph:user-circle-minus" class="text-6xl text-gray-200 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-navy mb-1">{{ t('event_categories.no_participants') }}</h3>
                    <div class="text-gray-400 text-sm">{{ t('event_categories.no_participants_desc') }}</div>
                </div>
            </template>
        </DashboardDataTable>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useI18n } from 'vue-i18n'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const route = useRoute()
const eventId = route.params.id
const categoryId = route.params.categoryId
const { get } = useApi()

definePageMeta({
    layout: 'dashboard'
})

const { t, locale } = useI18n()
const isLoading = ref(true)
const categoryName = ref('')
const participants = ref([])

const headers = computed(() => [
    { key: 'no', label: t('event_categories.table.no', 'No'), width: '60px', align: 'center', sortable: false },
    { key: 'name', label: t('event_categories.table.name', 'Pemanah'), sortable: true },
    { key: 'club_city', label: t('event_categories.table.club_city', 'Klub / Kota'), sortable: true },
    { key: 'payment_status', label: t('event_categories.table.status', 'Status'), sortable: true },
])

useHead({ title: computed(() => t('category.detail', 'Detail Kategori') + ' - Archeris Dashboard') })

const fetchData = async () => {
    isLoading.value = true
    try {
        // Fetch category info
        const catRes = await get(`/tournaments/${eventId}/categories/${categoryId}`)
        const cat = catRes?.category
        if (cat) {
            categoryName.value = `${cat.division_name} - ${cat.category_name} - ${cat.event_type_name}`
        }

        // Fetch participants for this category
        const partRes = await get(`/tournaments/${eventId}/participants`, {
            params: {
                category_id: categoryId,
                limit: 1000
            }
        })
        participants.value = partRes?.participants || []
    } catch (error) {
        console.error('Failed to fetch data:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchData)
</script>