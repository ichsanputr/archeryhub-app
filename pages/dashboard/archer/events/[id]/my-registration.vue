<template>
    <div class="flex flex-col gap-8 pb-16">
        <!-- Breadcrumbs & Header -->
        <div class="flex flex-col gap-1">
            <nav class="flex text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 items-center gap-2">
                <NuxtLink to="/dashboard/archer/events" class="hover:text-primary transition-colors">Event Saya
                </NuxtLink>
                <Icon icon="ph:caret-right-bold" class="text-[8px]" />
                <span class="text-slate-600 dark:text-slate-300">Data Registrasi</span>
            </nav>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <button @click="$router.back()"
                        class="size-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-all text-navy dark:text-white flex items-center justify-center group">
                        <Icon icon="ph:arrow-left-bold" class="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 class="text-3xl font-black text-navy dark:text-white tracking-tight leading-none">Status
                            Registrasi</h2>
                        <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Detail Pendaftaran &
                            Pembayaran</p>
                    </div>
                </div>

                <div v-if="participant" class="flex items-center gap-2">
                    <BaseButton variant="navy" icon="ph:printer-bold"
                        class="h-11 px-6 shadow-xl shadow-navy/10 text-xs font-black uppercase tracking-widest">
                        Cetak Invoice
                    </BaseButton>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <div
                    class="h-48 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
                <div
                    class="h-64 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
            </div>
            <div
                class="h-96 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
        </div>

        <template v-else-if="participant">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column: Profile & Registered Categories -->
                <div class="lg:col-span-2 space-y-8">

                    <!-- Premium Profile Header -->
                    <div
                        class="relative overflow-hidden rounded-[40px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-1">
                        <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-primary/10">
                        </div>
                        <div class="relative p-8 pt-12">
                            <div class="flex flex-col md:flex-row gap-8 items-center md:items-end">
                                <div class="relative group">
                                    <div
                                        class="size-32 rounded-[32px] border-[6px] border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-100">
                                        <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div
                                        class="absolute -bottom-2 -right-2 size-10 bg-primary text-navy rounded-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                                        <Icon icon="ph:user-circle-fill" class="text-xl" />
                                    </div>
                                </div>
                                <div class="flex-1 text-center md:text-left">
                                    <div
                                        class="flex flex-col md:flex-row md:items-center gap-3 mb-4 justify-center md:justify-start">
                                        <h1 class="text-4xl font-black text-navy dark:text-white tracking-tight">{{
                                            participant.full_name }}</h1>
                                        <span
                                            class="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                                            #{{ participant.athlete_code || 'ARCHER' }}
                                        </span>
                                    </div>
                                    <div
                                        class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 font-bold text-sm">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ph:shield-check-bold" class="text-primary" />
                                            {{ participant.club_name || 'Independent' }}
                                        </div>
                                        <div class="size-1 rounded-full bg-slate-200 hidden md:block"></div>
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ph:map-pin-bold" class="text-primary" />
                                            {{ participant.city || '-' }}
                                        </div>
                                        <div class="size-1 rounded-full bg-slate-200 hidden md:block"></div>
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ph:envelope-simple-bold" class="text-primary" />
                                            {{ participant.email }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Registered Categories -->
                    <div class="space-y-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-black text-navy dark:text-white flex items-center gap-3">
                                <Icon icon="ph:stack-bold" class="text-primary" />
                                Kategori Terdaftar
                            </h3>
                            <span
                                class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest">
                                {{ participant.categories?.length || 0 }} Kategori
                            </span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="cat in participant.categories" :key="cat.id"
                                class="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/30 transition-all group">
                                <div class="flex justify-between items-start mb-4">
                                    <div
                                        class="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-navy transition-colors">
                                        <Icon icon="ph:target-bold" class="text-xl" />
                                    </div>
                                    <span :class="getStatusClass(cat.payment_status)"
                                        class="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                                        {{ getDisplayStatus(cat.payment_status) }}
                                    </span>
                                </div>
                                <h4
                                    class="text-lg font-black text-navy dark:text-white leading-tight mb-2 uppercase tracking-tight line-clamp-2">
                                    {{ cat.category_name }}
                                </h4>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    {{ cat.division_name }} - {{ cat.event_type_name }}
                                </p>
                                <div
                                    class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <div class="flex flex-col">
                                        <span
                                            class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Bantalan</span>
                                        <span class="text-sm font-black text-navy dark:text-white">{{ cat.target_name ||
                                            '-' }}</span>
                                    </div>
                                    <div class="flex flex-col text-right">
                                        <span
                                            class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Biaya</span>
                                        <span class="text-sm font-black text-primary">Rp {{
                                            formatCurrency(cat.payment_amount) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Payment & QR -->
                <div class="space-y-8">
                    <!-- Overall Status & QR -->
                    <div
                        class="bg-white dark:bg-slate-800 rounded-[40px] p-8 text-navy dark:text-white border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                        <div class="absolute -top-12 -right-12 size-48 bg-primary/5 rounded-full blur-3xl"></div>
                        <div
                            class="absolute -bottom-12 -left-12 size-48 bg-slate-50 dark:bg-slate-900/50 rounded-full blur-3xl">
                        </div>

                        <div class="relative flex flex-col items-center">
                            <div class="w-full flex justify-between items-center mb-8">
                                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status
                                    Pendaftaran</span>
                                <span :class="getStatusClass(participant.payment_status)"
                                    class="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border">
                                    {{ getDisplayStatus(participant.payment_status) }}
                                </span>
                            </div>

                            <!-- Integrated QR Viewer -->
                            <div
                                class="relative bg-white p-6 rounded-[32px] shadow-2xl mb-8 group overflow-hidden border border-slate-100">
                                <div v-if="participant.payment_status === 'lunas'" class="relative">
                                    <QrcodeVue :value="participant.categories?.[0]?.qr_raw || participant.id"
                                        :size="180" level="H" render-as="svg" background="#ffffff"
                                        foreground="#1a2e4d" />
                                    <div
                                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm rounded-2xl">
                                        <Icon icon="ph:qr-code-bold" class="text-5xl text-navy animate-pulse" />
                                    </div>
                                </div>
                                <div v-else
                                    class="size-[180px] flex flex-col items-center justify-center text-slate-300 gap-3 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <Icon icon="ph:lock-key-bold" class="text-4xl" />
                                    <span class="text-[10px] font-black uppercase tracking-widest text-center px-4">QR
                                        Terkunci Hingga Pembayaran Lunas</span>
                                </div>
                            </div>

                            <div class="w-full space-y-4 mb-8">
                                <div
                                    class="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-primary/50 transition-colors">
                                    <div class="flex flex-col">
                                        <span
                                            class="text-[9px] font-black uppercase tracking-widest text-slate-400">Total
                                            Tagihan</span>
                                        <span class="text-xl font-black text-navy dark:text-white">Rp {{
                                            formatCurrency(participant.payment_amount) }}</span>
                                    </div>
                                    <div
                                        class="size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                                        <Icon icon="ph:wallet-bold" class="text-xl text-primary" />
                                    </div>
                                </div>

                                <!-- Payment Method Used -->
                                <div
                                    class="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span
                                            class="text-[9px] font-black uppercase tracking-widest text-slate-400">Metode
                                            Pembayaran</span>
                                        <span
                                            class="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-black uppercase tracking-tight border border-primary/20">
                                            {{ participant.transaction?.payment_method ||
                                                participant.payment_method_manual || 'Belum Dipilih' }}
                                        </span>
                                    </div>

                                    <div v-if="participant.transaction"
                                        class="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                                        <div class="flex justify-between text-[11px] font-bold">
                                            <span class="text-slate-400">Referensi</span>
                                            <span class="text-navy dark:text-white font-mono">{{
                                                participant.transaction.reference }}</span>
                                        </div>
                                        <div v-if="participant.transaction.status === 'pending'" class="mt-4">
                                            <BaseButton :to="participant.transaction.checkout_url" target="_blank"
                                                variant="primary" block
                                                class="h-11 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                                                Bayar Sekarang
                                                <Icon icon="ph:arrow-right-bold" class="ml-2" />
                                            </BaseButton>
                                        </div>
                                    </div>
                                    <div v-else-if="participant.payment_proof_urls?.length"
                                        class="pt-3 border-t border-slate-100 dark:border-slate-700">
                                        <div class="flex justify-between text-[11px] font-bold">
                                            <span class="text-slate-400">Jenis</span>
                                            <span class="text-navy dark:text-white">Transfer Manual (Dicek
                                                Panitia)</span>
                                        </div>
                                    </div>
                                    <div v-else-if="participant.payment_status === 'menunggu'" class="pt-4 space-y-4">
                                        <p class="text-[10px] text-slate-400 font-bold text-center">Pilih metode untuk
                                            melanjutkan pembayaran</p>
                                        <div class="grid grid-cols-1 gap-2">
                                            <BaseButton variant="primary" block @click="initiatePaymentGateway"
                                                :loading="isProcessingPayment"
                                                class="h-11 font-black uppercase tracking-widest text-[10px]">
                                                Payment Gateway (Otomatis)
                                            </BaseButton>
                                            <BaseButton variant="white" block @click="initiateManualPayment"
                                                class="h-11 font-black uppercase tracking-widest text-[10px] border-slate-200">
                                                Transfer Manual
                                            </BaseButton>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Proofs -->
                            <div v-if="participant.payment_proof_urls?.length" class="w-full">
                                <div class="flex items-center gap-2 mb-4">
                                    <div class="h-px bg-slate-100 dark:bg-slate-700 flex-1"></div>
                                    <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Bukti
                                        Transfer</span>
                                    <div class="h-px bg-slate-100 dark:bg-slate-700 flex-1"></div>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div v-for="(url, idx) in paymentProofs" :key="idx"
                                        class="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group relative cursor-pointer"
                                        @click="openImage(url)">
                                        <img :src="url"
                                            class="size-full object-cover group-hover:scale-110 transition-transform" />
                                        <div
                                            class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Icon icon="ph:magnifying-glass-plus-bold" class="text-xl text-white" />
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
            class="py-24 text-center bg-white dark:bg-slate-800 rounded-[48px] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50">
            <div
                class="size-24 bg-slate-50 dark:bg-slate-900 rounded-[32px] flex items-center justify-center text-slate-200 mx-auto mb-8 border border-slate-100 dark:border-slate-700">
                <Icon icon="ph:user-circle-gear-light" class="text-5xl" />
            </div>
            <h3 class="text-2xl font-black text-navy dark:text-white mb-3">Pendaftaran Tidak Ditemukan</h3>
            <p class="text-slate-400 text-sm font-medium max-w-sm mx-auto">Anda mungkin belum terdaftar di event ini
                atau sesi
                anda telah berakhir.</p>
            <BaseButton to="/dashboard/archer/events" variant="outline"
                class="mt-8 px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-xs">
                Kembali ke Dashboard
            </BaseButton>
        </div>

        <!-- Image Lightbox -->
        <AppDialog v-model:show="showImageDialog" title="Bukti Pembayaran" type="primary" icon="payments" size="lg">
            <template #default>
                <div class="flex justify-center -m-4 bg-slate-900 rounded-b-3xl overflow-hidden">
                    <img :src="selectedImage" class="max-w-full max-h-[75vh] object-contain" />
                </div>
            </template>
        </AppDialog>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
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
    return participant.value.payment_proof_urls
})

const isProcessingPayment = ref(false)

const initiatePaymentGateway = async () => {
    isProcessingPayment.value = true
    try {
        const response = await post(`/events/${eventId}/participants/me/checkout`)
        if (response?.checkout_url) {
            window.open(response.checkout_url, '_blank')
            await fetchInitialData()
        }
    } catch (e) {
        console.error('Failed to initiate checkout:', e)
        toast.error('Gagal memproses pembayaran')
    } finally {
        isProcessingPayment.value = false
    }
}

const initiateManualPayment = () => {
    // Navigate to manual payment view or show info
    toast.info('Silakan hubungi panitia untuk transfer manual atau unggah bukti di menu yang tersedia.')
}

const getStatusClass = (status, onNavy = false) => {
    const s = (status || '').toLowerCase()
    if (s === 'lunas') return onNavy ? 'bg-primary text-navy border-primary' : 'bg-green-50 text-green-600 border-green-200'
    return onNavy ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200'
}

const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'menunggu' || s === 'menunggu acc' || !s) return 'Menunggu ACC'
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

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
