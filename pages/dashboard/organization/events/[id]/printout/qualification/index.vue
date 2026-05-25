<template>
    <div class="flex flex-col gap-8 pb-20">
        <!-- Header with Breadcrumbs -->
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
                <NuxtLink :to="`/dashboard/events/${eventId}/printout`" class="hover:text-primary transition-colors">
                    {{ t('event_printout.title') }}</NuxtLink>
                <Icon icon="ph:caret-right-bold" />
                <span class="text-navy">{{ t('event_printout.scoresheet.title') }}</span>
            </div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <BaseButton variant="white" size="sm" icon="ph:arrow-left-bold"
                        class="!rounded-xl border border-gray-100 hover:border-primary/30 shadow-sm"
                        @click="navigateTo(`/dashboard/events/${eventId}/printout`)" />
                    <div>
                        <h1 class="text-3xl font-black text-navy tracking-tight">{{ t('event_printout.scoresheet.title') }}</h1>
                        <p class="text-gray-500 text-sm">{{ t('event_printout.scoresheet.page_desc') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <!-- Main Settings Form -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Configuration Card -->
                <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <div class="flex items-center gap-3 mb-8">
                        <div class="size-10 bg-navy rounded-xl flex items-center justify-center">
                            <Icon icon="ph:gear-six-bold" class="text-white text-xl" />
                        </div>
                        <h2 class="text-lg font-black text-navy">{{ t('event_printout.scoresheet.parameters_title') }}</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Session Selection -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-2 px-1">{{ t('event_printout.scoresheet.session_label') }}</label>
                                <BaseSelect v-model="form.session" :placeholder="t('event_printout.scoresheet.select_session_placeholder')" :items="sessionOptions"
                                    class="!border-gray-100 !rounded-2xl" />
                            </div>
                            <p class="text-[10px] text-slate-400 px-1 leading-relaxed italic">{{ t('event_printout.scoresheet.select_session_desc') }}</p>
                        </div>

                        <!-- Category Selection -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-2 px-1">{{ t('event_printout.scoresheet.filter_category_label') }}</label>
                                <BaseSelect v-model="form.category" :placeholder="t('event_printout.scoresheet.select_all_categories')"
                                    :items="categoryOptions" class="!border-gray-100 !rounded-2xl" />
                            </div>
                            <p class="text-[10px] text-slate-400 px-1 leading-relaxed italic">{{ t('event_printout.scoresheet.select_all_categories_desc') }}</p>
                        </div>

                        <!-- Target Range -->
                        <div class="space-y-4 md:col-span-2">
                            <label class="block text-xs font-bold text-slate-400 px-1">{{ t('event_printout.scoresheet.target_range_label') }}</label>
                            <div class="grid grid-cols-2 gap-4">
                                <BaseInput v-model="form.targetFrom" :placeholder="t('event_printout.scoresheet.placeholder_from')"
                                    class="!border-gray-100 !rounded-2xl" />
                                <BaseInput v-model="form.targetTo" :placeholder="t('event_printout.scoresheet.placeholder_to')"
                                    class="!border-gray-100 !rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Advanced Content Options Card -->
                <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <div class="flex items-center gap-3 mb-8">
                        <div class="size-10 bg-navy rounded-xl flex items-center justify-center">
                            <Icon icon="ph:list-checks-bold" class="text-white text-xl" />
                        </div>
                        <h2 class="text-lg font-black text-navy">{{ t('event_printout.scoresheet.additional_content_title') }}</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.addCompetitionHeader = !form.addCompetitionHeader">
                            <BaseCheckbox v-model="form.addCompetitionHeader" />
                            <span class="text-sm font-medium text-navy">{{ t('event_printout.scoresheet.add_competition_header') }}</span>
                        </div>
                            <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.addCompetitionImages = !form.addCompetitionImages">
                            <BaseCheckbox v-model="form.addCompetitionImages" />
                            <span class="text-sm font-medium text-navy">{{ t('event_printout.scoresheet.add_competition_images') }}</span>
                        </div>
                            <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.addCountryClubFlags = !form.addCountryClubFlags">
                            <BaseCheckbox v-model="form.addCountryClubFlags" />
                            <span class="text-sm font-medium text-navy">{{ t('event_printout.scoresheet.add_country_club_flags') }}</span>
                        </div>
                            <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.collectArchersBirthdateEmail = !form.collectArchersBirthdateEmail">
                            <BaseCheckbox v-model="form.collectArchersBirthdateEmail" />
                            <span class="text-sm font-medium text-navy">{{ t('event_printout.scoresheet.collect_birthdate_email') }}</span>
                        </div>
                            <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.printBarcode = !form.printBarcode">
                            <BaseCheckbox v-model="form.printBarcode" />
                            <span class="text-sm font-medium text-navy">{{ t('event_printout.scoresheet.print_barcode') }}</span>
                        </div>
                    </div>
                </div>

                <!-- Print Settings Card -->
                <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <div class="flex items-center gap-3 mb-8">
                        <div class="size-10 bg-navy rounded-xl flex items-center justify-center">
                            <Icon icon="ph:printer-bold" class="text-white text-xl" />
                        </div>
                        <h2 class="text-lg font-black text-navy">{{ t('event_printout.scoresheet.print_options_title') }}</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors cursor-pointer"
                            @click="form.autoPrint = !form.autoPrint">
                            <div class="flex-shrink-0">
                                <BaseCheckbox v-model="form.autoPrint" />
                            </div>
                            <div>
                                <h4 class="text-sm font-black text-navy">{{ t('event_printout.scoresheet.auto_print_label') }}</h4>
                                <p class="text-[10px] text-gray-400 font-bold">{{ t('event_printout.scoresheet.auto_print_desc') }}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors cursor-pointer"
                            @click="form.blankScoresheet = !form.blankScoresheet">
                            <div class="flex-shrink-0">
                                <BaseCheckbox v-model="form.blankScoresheet" />
                            </div>
                            <div>
                                <h4 class="text-sm font-black text-navy">{{ t('event_printout.scoresheet.blank_label') }}</h4>
                                <p class="text-[10px] text-gray-400 font-bold">{{ t('event_printout.scoresheet.blank_desc') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Preview & Actions Sidebar -->
            <div class="space-y-6">
                <!-- Document Summary Card -->
                <div class="bg-navy rounded-3xl p-8 text-white relative overflow-hidden shadow-sm">
                    <div class="absolute inset-0 opacity-10" style="background-image: var(--motif-pattern);"></div>

                    <div class="relative z-10 flex flex-col items-center text-center">
                        <div
                            class="size-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center mb-6">
                            <Icon icon="ph:file-pdf-bold" class="text-5xl text-primary" />
                        </div>

                        <h3 class="text-2xl font-black mb-2">{{ t('event_printout.scoresheet.document_summary_title') }}</h3>
                        <p class="text-xs text-slate-300 mb-8 max-w-[200px]">{{ t('event_printout.scoresheet.document_summary_desc') }}</p>

                        <div class="w-full space-y-4 pt-6 border-t border-white/10 text-[10px] font-bold">
                            <div class="flex justify-between items-center text-slate-400 tracking-widest">
                                <span>{{ t('event_printout.scoresheet.paper_size_label') }}</span>
                                <span class="text-white">A4 (Portrait)</span>
                            </div>
                            <div class="flex justify-between items-center text-slate-400 tracking-widest">
                                <span>{{ t('event_printout.scoresheet.layout_label') }}</span>
                                <span class="text-white">2 Scoresheets/Page</span>
                            </div>
                            <div class="flex justify-between items-center text-slate-400 tracking-widest">
                                <span>{{ t('event_printout.scoresheet.barcode_status_label') }}</span>
                                <span class="text-white">{{ form.printBarcode ? t('common.active') : t('common.inactive') }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <BaseButton variant="primary" icon="ph:printer-bold"
                    class="w-full !py-6 !rounded-3xl font-black tracking-widest text-sm shadow-sm"
                    :disabled="!form.session || isProcessing" :loading="isProcessing" @click="handlePrint">
                    {{ t('event_printout.print_pdf') }}
                </BaseButton>

                <p class="text-[10px] text-center text-slate-400 font-bold">{{ t('event_printout.scoresheet.process_info') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { get } = useApi()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const toast = useToast()

const eventId = route.params.id
const sessions = ref([])
const categories = ref([])
const isProcessing = ref(false)
const { t } = useI18n()

const form = ref({
    session: null,
    category: null,
    targetFrom: '',
    targetTo: '',
    autoPrint: true,
    blankScoresheet: false,
    addCompetitionHeader: true,
    addCompetitionImages: true,
    addCountryClubFlags: true,
    collectArchersBirthdateEmail: false,
    printBarcode: true
})

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: t('event_printout.scoresheet.page_title')
})

const sessionOptions = computed(() => {
    return sessions.value.map(s => ({
        title: `${s.name} (${s.session_code})`,
        value: s.session_code
    }))
})

const categoryOptions = computed(() => {
    return categories.value.map(c => ({
        title: `${c.division_name} ${c.category_name} ${c.gender_division_name}`,
        value: c.id
    }))
})

const fetchSessions = async () => {
    try {
        const response = await get(`/events/${eventId}/qualification/sessions`)
        sessions.value = response?.sessions || []
    } catch (error) {
        console.error('Failed to fetch sessions:', error)
    }
}

const fetchCategories = async () => {
    try {
        const response = await get(`/events/${eventId}/categories`)
        categories.value = response?.events || response?.categories || []
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const handlePrint = () => {
    if (!form.value.session) return

    isProcessing.value = true

    const apiBase = apiBaseUrl
    const params = new URLSearchParams()

    params.append('autoprint', form.value.autoPrint ? '1' : '0')
    params.append('blank', form.value.blankScoresheet ? '1' : '0')
    params.append('header', form.value.addCompetitionHeader ? '1' : '0')
    params.append('images', form.value.addCompetitionImages ? '1' : '0')
    params.append('flags', form.value.addCountryClubFlags ? '1' : '0')
    params.append('detail_info', form.value.collectArchersBirthdateEmail ? '1' : '0')
    params.append('barcode', form.value.printBarcode ? '1' : '0')

    if (form.value.category) params.append('category_id', form.value.category)
    if (form.value.targetFrom) params.append('target_from', form.value.targetFrom)
    if (form.value.targetTo) params.append('target_to', form.value.targetTo)

    const url = `${apiBase}/events/${eventId}/qualification/sessions/${form.value.session}/scoresheet?${params.toString()}`

    // Trigger direct download instead of opening new tab
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `Scoresheet_${form.value.session}.pdf`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)

    isProcessing.value = false
}

onMounted(() => {
    fetchSessions()
    fetchCategories()
})
</script>
