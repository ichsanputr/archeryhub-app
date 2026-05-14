<template>
    <div class="flex flex-col gap-8 pb-16">
        <!-- Breadcrumbs -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <nav class="flex text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 items-center gap-2">
                    <NuxtLink :to="`/dashboard/events/${eventId}`" class="hover:text-primary transition-colors">Event
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-slate-600 dark:text-slate-300">Registrasi Saya</span>
                </nav>
                <div class="flex items-center gap-4">
                    <button @click="$router.back()"
                        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-all text-navy dark:text-white">
                        <Icon icon="ph:arrow-left-bold" />
                    </button>
                    <h2 class="text-3xl font-black text-navy dark:text-white tracking-tight">Data Registrasi</h2>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="space-y-6">
            <div
                class="h-48 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
            <div class="h-96 bg-white dark:bg-slate-800 rounded-3xl animate-pulse" />
        </div>

        <template v-else-if="participant">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Participant Info Column -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- Athlete Profile Card -->
                    <div
                        class="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200/30 overflow-hidden">
                        <div class="p-8">
                            <div
                                class="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                <div class="relative">
                                    <div
                                        class="w-32 h-32 rounded-3xl border-4 border-primary p-1 bg-white dark:bg-slate-800 shadow-sm">
                                        <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                            class="w-full h-full rounded-2xl object-cover" />
                                    </div>
                                    <div
                                        class="absolute -bottom-2 -right-2 bg-navy text-white text-[10px] font-black px-3 py-1.5 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm">
                                        ARCHER
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <div class="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                        <h3 class="text-3xl font-black text-navy dark:text-white tracking-tight">{{
                                            participant.full_name }}</h3>
                                        <span
                                            class="inline-flex px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 font-black text-[10px] capitalize tracking-widest border border-slate-200 dark:border-slate-600">
                                            #{{ participant.bib_number || '-' }}
                                        </span>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                            <Icon icon="ph:envelope-bold" class="text-primary text-xl" />
                                            <span class="text-sm font-medium">{{ participant.email }}</span>
                                        </div>
                                        <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                            <Icon icon="ph:shield-check-bold" class="text-primary text-xl" />
                                            <span class="text-sm font-medium">{{ participant.club_name || 'Independent'
                                                }}</span>
                                        </div>
                                        <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                            <Icon icon="ph:phone-bold" class="text-primary text-xl" />
                                            <span class="text-sm font-medium">{{ participant.phone || '-' }}</span>
                                        </div>
                                        <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                            <Icon icon="ph:map-pin-bold" class="text-primary text-xl" />
                                            <span class="text-sm font-medium">{{ participant.city || '-' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Kategori & Target Info -->
                    <div
                        class="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200/30 overflow-hidden p-8">
                        <h4 class="text-xl font-black text-navy dark:text-white mb-6 flex items-center gap-3">
                            <Icon icon="ph:squares-four-bold" class="text-primary" />
                            Detail Pertandingan
                        </h4>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                class="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl group transition-all hover:border-primary/30">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Divisi &
                                    Kategori</p>
                                <p class="text-lg font-black text-navy dark:text-white leading-tight">
                                    {{ participant.category_name || participant.division_name }}
                                </p>
                                <p class="text-xs text-slate-400 mt-1 font-bold">{{ participant.division_name }} - {{
                                    participant.age_category || '-' }}</p>
                            </div>

                            <div
                                class="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl group transition-all hover:border-primary/30 text-center">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nomor
                                    Bantalan</p>
                                <div class="flex items-center justify-center gap-2">
                                    <Icon icon="ph:target-bold" class="text-primary text-2xl" />
                                    <p class="text-3xl font-black text-navy dark:text-white tracking-tighter">{{
                                        participant.target_name || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Registration & Status Column -->
                <div class="space-y-8">
                    <!-- Status Card -->
                    <div
                        class="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200/30 overflow-hidden p-8">
                        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Status Pembayaran
                        </h4>

                        <div class="flex flex-col gap-6">
                            <div class="flex items-center justify-between p-4 rounded-2xl border"
                                :class="getStatusClass(participant.payment_status)">
                                <div class="flex items-center gap-3">
                                    <Icon
                                        :icon="participant.payment_status === 'lunas' ? 'ph:check-circle-fill' : 'ph:clock-bold'"
                                        class="text-2xl" />
                                    <span class="font-black uppercase tracking-widest text-xs">{{
                                        getDisplayStatus(participant.payment_status) }}</span>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="flex justify-between items-center text-sm font-bold">
                                    <span class="text-slate-400">ID Registrasi</span>
                                    <span class="text-navy dark:text-white">#{{ participant.id }}</span>
                                </div>
                                <div class="flex justify-between items-center text-sm font-bold">
                                    <span class="text-slate-400">Tagihan</span>
                                    <span class="text-navy dark:text-white">Rp {{
                                        formatCurrency(participant.payment_amount || 0) }}</span>
                                </div>
                            </div>

                            <div v-if="participant.payment_proof_urls && participant.payment_proof_urls.length"
                                class="mt-4">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Bukti
                                    Pembayaran</p>
                                <div class="space-y-4">
                                    <div v-for="(url, idx) in paymentProofs" :key="idx" class="relative group">
                                        <div
                                            class="aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-900">
                                            <img :src="url" alt="Bukti Pembayaran"
                                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div
                                                class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button @click="openImage(url)"
                                                    class="p-3 bg-primary text-navy rounded-xl shadow-sm shadow-primary/20">
                                                    <Icon icon="ph:magnifying-glass-plus-bold" class="text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div v-else
            class="py-20 text-center bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700">
            <Icon icon="ph:user-circle-gear-light" class="text-7xl text-slate-200 mx-auto mb-6" />
            <h3 class="text-xl font-black text-navy dark:text-white mb-2">Pendaftaran Tidak Ditemukan</h3>
            <p class="text-slate-400 text-sm font-medium">Anda mungkin belum terdaftar di event ini atau sesi anda telah
                berakhir.</p>
        </div>

        <!-- Image Lightbox -->
        <AppDialog v-model:show="showImageDialog" title="Bukti Pembayaran" type="primary" icon="payments" size="lg">
            <template #default>
                <div class="flex justify-center -m-4 bg-slate-900 rounded-b-2xl overflow-hidden">
                    <img :src="selectedImage" class="max-w-full max-h-[70vh] object-contain" />
                </div>
            </template>
        </AppDialog>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const { get } = useApi()
const route = useRoute()
const eventId = route.params.id

definePageMeta({
    layout: 'dashboard'
})

const isLoading = ref(true)
const participant = ref(null)
const showImageDialog = ref(false)
const selectedImage = ref('')

const paymentProofs = computed(() => {
    if (!participant.value?.payment_proof_urls) return []
    const urls = participant.value.payment_proof_urls
    return Array.isArray(urls) ? urls : urls.split(',').map(u => u.trim()).filter(Boolean)
})

const getStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'lunas') return 'bg-green-500/10 text-green-500 border-green-500/20'
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
}

const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'menunggu' || s === 'menunggu acc' || !s) return 'UNPAID'
    return s.toUpperCase()
}

const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID').format(val)
}

const openImage = (url) => {
    selectedImage.value = url
    showImageDialog.value = true
}

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const detailed = await get(`/events/${eventId}/participants/me`)
        participant.value = detailed
    } catch (e) {
        console.error('Failed to fetch registration data:', e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchInitialData()
})
</script>
