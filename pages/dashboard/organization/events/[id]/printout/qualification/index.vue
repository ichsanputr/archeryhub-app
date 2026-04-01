<template>
    <div class="flex flex-col gap-8 pb-20">
        <!-- Header with Breadcrumbs -->
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
                <NuxtLink :to="`/dashboard/events/${eventId}/printout`" class="hover:text-primary transition-colors">
                    Printout</NuxtLink>
                <Icon icon="ph:caret-right-bold" />
                <span class="text-navy">Sesi kualifikasi</span>
            </div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <BaseButton variant="white" size="sm" icon="ph:arrow-left-bold"
                        class="!rounded-xl border border-gray-100 hover:border-primary/30 shadow-sm"
                        @click="navigateTo(`/dashboard/events/${eventId}/printout`)" />
                    <div>
                        <h1 class="text-3xl font-black text-navy tracking-tight">Cetak scoresheet kualifikasi</h1>
                        <p class="text-gray-500 text-sm">Atur dan cetak lembar skor untuk babak kualifikasi.</p>
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
                        <h2 class="text-lg font-black text-navy">Parameter cetak</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Session Selection -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-2 px-1">Sesi kualifikasi</label>
                                <BaseSelect v-model="form.session" placeholder="Pilih sesi" :items="sessionOptions"
                                    class="!border-gray-100 !rounded-2xl" />
                            </div>
                            <p class="text-[10px] text-slate-400 px-1 leading-relaxed italic">
                                Pilih sesi kualifikasi yang akan dicetak scoresheet-nya.
                            </p>
                        </div>

                        <!-- Category Selection -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-2 px-1">Filter kategori
                                    (opsional)</label>
                                <BaseSelect v-model="form.category" placeholder="Semua kategori"
                                    :items="categoryOptions" class="!border-gray-100 !rounded-2xl" />
                            </div>
                            <p class="text-[10px] text-slate-400 px-1 leading-relaxed italic">
                                Kosongkan untuk mencetak seluruh kategori dalam sesi tersebut.
                            </p>
                        </div>

                        <!-- Target Range -->
                        <div class="space-y-4 md:col-span-2">
                            <label class="block text-xs font-bold text-slate-400 px-1">Rentang target (opsional)</label>
                            <div class="grid grid-cols-2 gap-4">
                                <BaseInput v-model="form.targetFrom" placeholder="Dari (contoh: 01)"
                                    class="!border-gray-100 !rounded-2xl" />
                                <BaseInput v-model="form.targetTo" placeholder="Sampai (contoh: 10)"
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
                        <h2 class="text-lg font-black text-navy">Konten tambahan</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.addCompetitionHeader = !form.addCompetitionHeader">
                            <BaseCheckbox v-model="form.addCompetitionHeader" />
                            <span class="text-sm font-medium text-navy">Tambah header kompetisi</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.addCompetitionImages = !form.addCompetitionImages">
                            <BaseCheckbox v-model="form.addCompetitionImages" />
                            <span class="text-sm font-medium text-navy">Tambah gambar kompetisi</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.addCountryClubFlags = !form.addCountryClubFlags">
                            <BaseCheckbox v-model="form.addCountryClubFlags" />
                            <span class="text-sm font-medium text-navy">Tambah bendera negara/klub</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.collectArchersBirthdateEmail = !form.collectArchersBirthdateEmail">
                            <BaseCheckbox v-model="form.collectArchersBirthdateEmail" />
                            <span class="text-sm font-medium text-navy">Cetak tgl lahir & email</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            @click="form.printBarcode = !form.printBarcode">
                            <BaseCheckbox v-model="form.printBarcode" />
                            <span class="text-sm font-medium text-navy">Cetak barcode pada scoresheet</span>
                        </div>
                    </div>
                </div>

                <!-- Print Settings Card -->
                <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <div class="flex items-center gap-3 mb-8">
                        <div class="size-10 bg-navy rounded-xl flex items-center justify-center">
                            <Icon icon="ph:printer-bold" class="text-white text-xl" />
                        </div>
                        <h2 class="text-lg font-black text-navy">Opsi pencetakan</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors cursor-pointer"
                            @click="form.autoPrint = !form.autoPrint">
                            <div class="flex-shrink-0">
                                <BaseCheckbox v-model="form.autoPrint" />
                            </div>
                            <div>
                                <h4 class="text-sm font-black text-navy">Auto print</h4>
                                <p class="text-[10px] text-gray-400 font-bold">Munculkan dialog cetak otomatis saat
                                    halaman dibuka</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors cursor-pointer"
                            @click="form.blankScoresheet = !form.blankScoresheet">
                            <div class="flex-shrink-0">
                                <BaseCheckbox v-model="form.blankScoresheet" />
                            </div>
                            <div>
                                <h4 class="text-sm font-black text-navy">Scoresheet kosong</h4>
                                <p class="text-[10px] text-gray-400 font-bold">Hanya cetak template scoresheet tanpa
                                    data peserta</p>
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

                        <h3 class="text-2xl font-black mb-2">Ringkasan dokumen</h3>
                        <p class="text-xs text-slate-300 mb-8 max-w-[200px]">Dokumen akan dirender dalam format PDF
                            dengan ukuran A4 standar Ianseo.</p>

                        <div class="w-full space-y-4 pt-6 border-t border-white/10 text-[10px] font-bold">
                            <div class="flex justify-between items-center text-slate-400 uppercase tracking-widest">
                                <span>Ukuran kertas</span>
                                <span class="text-white">A4 (Portrait)</span>
                            </div>
                            <div class="flex justify-between items-center text-slate-400 uppercase tracking-widest">
                                <span>Layout</span>
                                <span class="text-white">2 Scoresheets/Page</span>
                            </div>
                            <div class="flex justify-between items-center text-slate-400 uppercase tracking-widest">
                                <span>Status barcode</span>
                                <span class="text-white">{{ form.printBarcode ? 'Aktif' : 'Nonaktif' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <BaseButton variant="primary" icon="ph:printer-bold"
                    class="w-full !py-6 !rounded-3xl font-black uppercase tracking-widest text-sm shadow-sm"
                    :disabled="!form.session || isProcessing" :loading="isProcessing" @click="handlePrint">
                    Cetak PDF
                </BaseButton>

                <p class="text-[10px] text-center text-slate-400 font-bold">
                    Data akan diproses oleh layanan printout internal ArcheryHub.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const { get } = useApi()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const toast = useToast()

const eventId = route.params.id
const sessions = ref([])
const categories = ref([])
const isProcessing = ref(false)

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
    title: 'Cetak scoresheet kualifikasi - ArcheryHub.id'
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
