<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

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

const form = reactive({
    category_ids: [],
    notes: ''
})

useHead({
    title: computed(() => `${t('participant.edit.title', 'Edit Data Peserta')} - Archeris Dashboard`)
})

onMounted(async () => {
    await fetchParticipantData()
})

const fetchParticipantData = async () => {
    if (!archerId.value || !eventId.value) return
    isLoading.value = true
    try {
        const [partRes, catRes] = await Promise.all([
            get(`/tournaments/${eventId.value}/participants/${archerId.value}`),
            get(`/tournaments/${eventId.value}/categories`)
        ])
        const p = partRes?.data || partRes
        participant.value = p
        
        // Extract categories list properly from catRes
        const catList = catRes?.events || catRes?.categories || catRes?.data || (Array.isArray(catRes) ? catRes : [])
        categories.value = catList

        // Populate registered category IDs
        if (p.categories && Array.isArray(p.categories) && p.categories.length > 0) {
            form.category_ids = p.categories.map(c => c.category_id || c.id).filter(Boolean)
        } else if (p.category_id) {
            form.category_ids = [p.category_id]
        } else if (p.category_ids && Array.isArray(p.category_ids)) {
            form.category_ids = [...p.category_ids]
        } else {
            form.category_ids = []
        }

        form.notes = p.notes || ''
    } catch (err) {
        console.error('Failed to load participant for edit:', err)
        toast.error(t('common.error_loading', 'Gagal memuat data peserta'))
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
    return parts.length > 0 ? parts.join(' • ') : (cat.category_code || 'Kategori')
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

const toggleCategory = (id) => {
    const idx = form.category_ids.indexOf(id)
    if (idx > -1) {
        if (form.category_ids.length === 1) {
            toast.warning(t('participant.edit.min_one_category', 'Peserta minimal harus mengikuti 1 kategori'))
            return
        }
        form.category_ids.splice(idx, 1)
    } else {
        form.category_ids.push(id)
    }
}

const handleSubmit = async () => {
    if (!archerId.value || !eventId.value) return
    isSubmitting.value = true
    try {
        await put(`/tournaments/${eventId.value}/participants/${archerId.value}`, {
            category_ids: form.category_ids,
            notes: form.notes
        })
        toast.success(t('participant.edit.save_success', 'Perubahan data peserta berhasil disimpan'))
        router.push(`/dashboard/organizer/tournaments/${eventId.value}/participants/detail?archer_id=${archerId.value}`)
    } catch (err) {
        console.error('Failed to save participant changes:', err)
        toast.error(err?.data?.error || t('common.error_saving', 'Gagal menyimpan perubahan'))
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

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <div class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shrink-0">
                            <Icon icon="ph:pencil-simple-bold" class="text-white text-2xl" />
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 text-xs text-white/60 mb-1">
                                <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/participants`" class="hover:text-white transition-colors">
                                    {{ t('dashboard.participants_list.title', 'Daftar Peserta') }}
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                                <span class="text-primary font-medium">{{ t('participant.edit.title', 'Edit Data Peserta') }}</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white truncate">
                                {{ participant?.full_name || t('participant.edit.title', 'Edit Data Peserta') }}
                            </h1>
                            <div class="text-slate-300 text-sm mt-1">
                                {{ t('participant.edit.subtitle', 'Ubah kategori lomba, status pembayaran, dan data registrasi atlet.') }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 shrink-0">
                        <BaseButton :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${archerId}`" variant="white" class="h-10 px-4 text-sm font-bold">
                            {{ t('common.cancel', 'Batal') }}
                        </BaseButton>
                        <BaseButton variant="primary" icon="ph:floppy-disk-bold"
                            class="h-10 px-5 text-sm font-black shadow-md shadow-primary/20"
                            :loading="isSubmitting"
                            @click="handleSubmit">
                            {{ t('common.save_changes', 'Simpan Perubahan') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="isLoading">
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div class="inline-block size-8 border-2 border-slate-300 border-t-slate-800 animate-spin rounded-full"></div>
                <div class="text-slate-500 mt-4 text-sm font-medium">{{ t('participant.detail.loading', 'Memuat data peserta...') }}</div>
            </div>
        </template>

        <template v-else-if="participant">
            <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left 2 Columns: All-in-One White Card -->
                <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">

                    <!-- Section 1: Profile Summary -->
                    <div class="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
                        <div class="size-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-3">
                                <h2 class="text-lg font-bold text-slate-900 truncate">{{ participant.full_name }}</h2>
                            </div>
                            <div class="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                                <span>{{ participant.athlete_code || 'ID: ' + (participant.archer_id || '-').substring(0, 8) }}</span>
                                <span>•</span>
                                <span>{{ participant.club_name || t('participant.edit.independent', 'Klub Independen') }}</span>
                                <span>•</span>
                                <span>{{ participant.email || '-' }}</span>
                                <template v-if="participant.city">
                                    <span>•</span>
                                    <span>{{ participant.city }}</span>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Category Selection -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Icon icon="ph:trophy-bold" class="text-slate-500" />
                                <span>{{ t('participant.detail.division_label', 'Pilih Kategori Turnamen') }}</span>
                            </h3>
                            <span class="text-xs text-slate-400 font-medium">
                                {{ form.category_ids.length }} {{ t('participant.edit.categories_selected', 'Kategori Dipilih') }}
                            </span>
                        </div>

                        <div class="relative">
                            <input v-model="categorySearch" type="text"
                                :placeholder="t('participant.detail.search_placeholder', 'Cari kategori lomba...')"
                                class="w-full h-10 px-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-slate-800 transition-all font-medium" />
                            <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        </div>

                        <div v-if="filteredCategories.length > 0" class="max-h-[360px] overflow-y-auto pr-1 space-y-2">
                            <div v-for="category in filteredCategories" :key="category.id"
                                class="p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group"
                                :class="form.category_ids.includes(category.id)
                                    ? 'border-slate-800 bg-slate-50 shadow-xs'
                                    : 'border-slate-200 bg-white hover:border-slate-300'"
                                @click="toggleCategory(category.id)">
                                <div class="flex items-center gap-3">
                                    <div class="size-5 rounded-md border flex items-center justify-center transition-all"
                                        :class="form.category_ids.includes(category.id)
                                            ? 'bg-slate-900 border-slate-900 text-white'
                                            : 'bg-white border-slate-300 group-hover:border-slate-500'">
                                        <Icon v-if="form.category_ids.includes(category.id)" icon="ph:check-bold" class="text-[10px]" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-slate-900 leading-tight">
                                            {{ getCategoryTitle(category) }}
                                        </div>
                                        <div class="text-xs text-slate-500 mt-0.5">
                                            {{ getCategorySubtitle(category) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="py-6 text-center text-xs text-slate-400 italic">
                            {{ t('participant.edit.no_categories', 'Belum ada kategori turnamen yang tersedia.') }}
                        </div>
                    </div>
                </div>

                <!-- Right Sidebar Column: All-in-One White Card -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    <div class="border-b border-slate-100 pb-3">
                        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Icon icon="ph:floppy-disk-bold" class="text-slate-500 text-base" />
                            <span>{{ t('participant.edit.form_actions', 'Aksi Formulir') }}</span>
                        </h3>
                    </div>

                    <!-- Form Actions -->
                    <div class="space-y-3">
                        <BaseButton type="submit" variant="primary" icon="ph:floppy-disk-bold"
                            class="w-full h-10 justify-center text-xs font-black shadow-md shadow-primary/20"
                            :loading="isSubmitting">
                            {{ t('common.save_changes', 'Simpan Perubahan') }}
                        </BaseButton>
                        <BaseButton :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${archerId}`"
                            variant="white" class="w-full h-10 justify-center text-xs font-bold border-slate-200">
                            {{ t('common.cancel', 'Batal') }}
                        </BaseButton>
                    </div>
                </div>
            </form>
        </template>
    </div>
</template>
