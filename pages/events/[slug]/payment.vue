<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-10">
        <!-- Loading State -->
        <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <span class="material-symbols-outlined text-4xl text-primary animate-spin mb-4">sync</span>
                <div class="text-gray-500">Memuat data pembayaran...</div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <div class="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span class="material-symbols-outlined text-3xl text-red-500">error</span>
                </div>
                <h2 class="text-xl font-black text-navy mb-3">Gagal Memuat Data</h2>
                <div class="text-gray-500 mb-6">{{ error }}</div>
                <BaseButton @click="loadData" variant="navy" size="md">
                    Coba Lagi
                </BaseButton>
            </div>
        </div>

        <template v-else>
            <!-- Hero Header (Verbatim sync from register.vue) -->
            <div class="bg-navy relative overflow-hidden h-[240px] md:h-[320px] flex items-center">
                <div class="absolute inset-0 z-0">
                    <img :alt="event?.name" class="w-full h-full object-cover object-center"
                        :src="event?.banner_url || '/hero-event-detail.jpeg'" />
                    <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                    </div>
                </div>
                <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 md:mt-4 w-full">
                    <div class="flex flex-col lg:flex-row items-end justify-between gap-8 mb-6 md:mb-10">
                        <div class="max-w-3xl">
                            <h1
                                class="text-2xl md:text-4xl font-black leading-tight tracking-tight mb-2 md:mb-4 font-display text-white">
                                Pembayaran {{ event?.name }}
                            </h1>
                            <div class="flex flex-wrap items-center gap-4 text-white/80 text-sm md:text-base">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:calendar-blank" class="text-primary" />
                                    <span>{{ formatEventDate(event) }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:map-pin" class="text-primary" />
                                    <span>{{ event?.location || 'TBA' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 -mt-8 relative z-30">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 space-y-6">
                        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <h2 class="text-lg font-black text-navy flex items-center gap-3">
                                    <div
                                        class="h-9 w-9 rounded-xl bg-navy flex items-center justify-center text-primary shadow-sm">
                                        <span class="material-symbols-outlined text-lg">payments</span>
                                    </div>
                                    Pilih Metode Pembayaran
                                </h2>
                            </div>

                            <div class="p-6 md:p-8 space-y-8">
                                <div v-if="loadingChannels" class="flex justify-center py-10">
                                    <div class="animate-spin material-symbols-outlined text-4xl text-primary">sync</div>
                                </div>

                                <div v-else-if="channels.length === 0" class="text-center py-10">
                                    <Icon icon="ph:warning-circle" class="text-4xl text-amber-500 mx-auto mb-3" />
                                    <div class="text-navy font-bold">Metode pembayaran tidak tersedia</div>
                                    <div class="text-gray-500 text-sm mt-1">Silakan hubungi penyelenggara event.</div>
                                </div>

                                <div v-else v-for="(group, name) in groupedChannels" :key="name" class="space-y-4">
                                    <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{{ name
                                        }}</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label v-for="channel in group" :key="channel.code"
                                            class="relative flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                                            :class="selectedChannel === channel.code ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-50 bg-gray-50/30'">
                                            <input type="radio" v-model="selectedChannel" :value="channel.code"
                                                class="sr-only">
                                            <div class="flex items-center gap-4 w-full">
                                                <div
                                                    class="w-12 h-12 bg-white rounded-xl border border-gray-100 p-2 flex items-center justify-center shrink-0 shadow-sm">
                                                    <img :src="channel.icon_url" :alt="channel.name"
                                                        class="max-w-full max-h-full object-contain">
                                                </div>
                                                <div class="flex-grow">
                                                    <div
                                                        class="text-sm font-black text-navy group-hover:text-primary transition-colors">
                                                        {{ channel.name }}
                                                    </div>
                                                    <div class="text-[10px] text-gray-500 font-medium">Biaya: Rp {{
                                                        formatNumber(channel.total_fee) }}</div>
                                                </div>
                                                <div v-if="selectedChannel === channel.code" class="text-primary">
                                                    <Icon icon="ph:check-circle-fill" class="text-2xl" />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 md:p-8 pt-0">
                                <BaseButton @click="handlePayment" :disabled="!selectedChannel || loading"
                                    variant="primary" size="lg" block icon="lock" :loading="loading"
                                    class="h-14 !rounded-2xl shadow-lg shadow-primary/20">
                                    Bayar Sekarang
                                </BaseButton>
                            </div>
                        </section>
                    </div>

                    <!-- Order Summary -->
                    <aside class="space-y-6">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 class="text-lg font-black text-navy mb-4 flex items-center gap-2">
                                <Icon icon="ph:receipt" />
                                Ringkasan Pesanan
                            </h3>
                            <div class="flex gap-4 mb-6 pt-4 border-t border-gray-100">
                                <div
                                    class="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50 shadow-inner">
                                    <img :src="event?.banner_url || '/hero-event-detail.jpeg'"
                                        class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-black text-navy line-clamp-2 leading-tight mb-1">{{
                                        event?.name }}</div>
                                    <div
                                        class="text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md inline-block">
                                        {{ registration?.division_name || registration?.division || 'Semua Divisi' }} -
                                        {{ registration?.category_name || registration?.category || 'Semua Kategori' }}
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3 mb-6">
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-500 font-medium">Biaya Pendaftaran</span>
                                    <span class="font-bold text-navy">Rp {{ formatNumber(registration?.payment_amount)
                                        }}</span>
                                </div>
                                <div v-if="selectedChannelData" class="flex justify-between items-center text-sm">
                                    <span class="text-gray-500 font-medium">Biaya Layanan ({{ selectedChannelData.name
                                        }})</span>
                                    <span class="font-bold text-primary">+ Rp {{ formatNumber(transactionFee) }}</span>
                                </div>
                                <div
                                    class="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                                    <span class="text-base font-black text-navy uppercase tracking-wider">Total
                                        Bayar</span>
                                    <div class="text-right">
                                        <div class="text-2xl font-black text-navy">Rp {{ formatNumber(totalAmount) }}
                                        </div>
                                        <div class="text-[10px] text-gray-400 font-medium italic mt-0.5">*Sudah termasuk
                                            biaya admin</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useDateFormat } from '@vueuse/core'

definePageMeta({
    layout: 'blank'
})

const route = useRoute()
const router = useRouter()
const { get } = useApi()
const slug = route.params.slug
const registrationId = route.query.registration_id
const payment = usePayment()

const isLoading = ref(true)
const loadingChannels = ref(true)
const loading = ref(false)
const channels = ref([])
const selectedChannel = ref(null)
const registration = ref(null)
const event = ref(null)
const error = ref('')

const formatNumber = (val) => {
    const num = Number(val)
    if (isNaN(num)) return '0'
    return new Intl.NumberFormat('id-ID').format(num)
}

const formatEventDate = (evt) => {
    if (!evt) return 'TBA'
    if (!evt.start_date) return 'TBA'

    const start = useDateFormat(evt.start_date, 'DD MMM YYYY', { locales: 'id-ID' }).value
    if (!evt.end_date) return start

    const end = useDateFormat(evt.end_date, 'DD MMM YYYY', { locales: 'id-ID' }).value
    if (start === end) return start
    return `${start} - ${end}`
}

const loadData = async () => {
    isLoading.value = true
    error.value = ''
    try {
        console.log(`[DEBUG] Loading payment page for slug: ${slug}, registration: ${registrationId}`)

        // Fetch event details first
        const eventData = await get(`/events/${slug}`)
        event.value = eventData

        // Fetch registration info
        if (registrationId) {
            const regData = await get(`/events/${slug}/participants/${registrationId}`)
            registration.value = regData
        } else {
            error.value = 'Registration ID tidak ditemukan.'
        }

        // Fetch payment channels
        loadingChannels.value = true
        channels.value = await payment.getChannels()
    } catch (err) {
        console.error('Failed to load payment data:', err)
        error.value = err?.data?.error || 'Gagal memuat data pembayaran. Silakan periksa koneksi Anda.'
    } finally {
        isLoading.value = false
        loadingChannels.value = false
    }
}

onMounted(() => {
    loadData()
})

const groupedChannels = computed(() => {
    const groups = {
        'Virtual Accounts': [],
        'E-Wallets': [],
        'Convenience Store': [],
        'QRIS': []
    }

    channels.value.forEach(channel => {
        if (channel.active) {
            if (channel.code === 'QRIS') groups['QRIS'].push(channel)
            else if (['OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY'].includes(channel.code)) groups['E-Wallets'].push(channel)
            else if (['ALFAMART', 'INDOMARET'].includes(channel.code)) groups['Convenience Store'].push(channel)
            else groups['Virtual Accounts'].push(channel)
        }
    })

    // Filter out empty groups
    return Object.fromEntries(Object.entries(groups).filter(([_, v]) => v.length > 0))
})

const selectedChannelData = computed(() => {
    return channels.value.find(c => c.code === selectedChannel.value)
})

const totalAmount = computed(() => {
    const baseAmount = Number(registration.value?.payment_amount) || 0
    if (selectedChannelData.value) {
        const feeFlat = Number(selectedChannelData.value.fee_customer?.flat) || 0
        const feePercent = Number(selectedChannelData.value.fee_customer?.percent) || 0

        let total = baseAmount + feeFlat
        if (feePercent > 0) {
            total = total / (1 - (feePercent / 100))
        }
        return Math.ceil(total)
    }
    return baseAmount
})

const transactionFee = computed(() => {
    return totalAmount.value - (Number(registration.value?.payment_amount) || 0)
})

const handlePayment = async () => {
    if (!selectedChannel.value || !registrationId) return

    loading.value = true
    try {
        const res = await payment.createTransaction({
            method: selectedChannel.value,
            event_id: event.value?.uuid || event.value?.id,
            registration_id: registrationId,
            type: 'registration'
        })

        if (res && res.reference) {
            router.push(`/payment/status/${res.reference}`)
        }
    } catch (err) {
        console.error('Payment error:', err)
        alert(err?.data?.error || 'Gagal memproses pembayaran. Silakan coba lagi.')
    } finally {
        loading.value = false
    }
}
</script>
