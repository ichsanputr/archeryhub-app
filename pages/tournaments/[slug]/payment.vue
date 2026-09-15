<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-10">
        <!-- Loading State -->
        <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <Icon icon="ph:arrows-clockwise-bold" class="text-4xl text-navy animate-spin mb-4 mx-auto" />
                <div class="text-gray-500">Memuat data pembayaran...</div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <div class="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon icon="ph:warning-circle-bold" class="text-3xl text-red-500" />
                </div>
                <h2 class="text-xl font-black text-navy mb-3">Gagal Memuat Data</h2>
                <div class="text-gray-500 mb-6">{{ error }}</div>
                <BaseButton @click="loadData" variant="navy" size="md">
                    Coba Lagi
                </BaseButton>
            </div>
        </div>

        <template v-else>
            <!-- Hero Header -->
            <div class="bg-navy relative overflow-hidden h-[200px] md:h-[280px] flex items-center">
                <div class="absolute inset-0 z-0">
                    <img alt="Hero Background" class="w-full h-full object-cover object-center"
                        src="/hero-event-detail.jpeg" />
                    <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-transparent"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent"></div>
                </div>
                <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 md:mt-10">
                    <div class="max-w-3xl">
                        <nav class="flex text-sm font-black text-white/40 mb-2 items-center gap-2">
                            <NuxtLink :to="`/tournaments/${event?.slug}`" class="hover:text-white transition-colors">Event
                            </NuxtLink>
                            <Icon icon="ph:caret-right-bold" />
                            <span>Pembayaran</span>
                        </nav>
                        <h1
                            class="text-xl md:text-3xl font-black leading-tight tracking-tight mb-4 font-display text-white -none">
                            Pembayaran {{ event?.name }}
                        </h1>
                        <div class="flex flex-wrap items-center gap-6 text-white/70">
                            <div class="flex items-center gap-2 text-xs font-bold">
                                <Icon icon="ph:calendar-blank" class="text-white/40" />
                                <span>{{ formatEventDate(event) }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs font-bold">
                                <Icon icon="ph:map-pin" class="text-white/40" />
                                <span>{{ event?.location || 'TBA' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 -mt-6 md:-mt-10 relative z-30">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    <!-- Left Column: Payment Options -->
                    <div class="lg:col-span-8 space-y-6">

                        <section class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="p-6 md:p-8 border-b border-gray-50">
                                <h2 class="text-lg font-black text-navy flex items-center gap-3">
                                    <Icon icon="ph:credit-card-bold" class="text-gray-400" />
                                    Pilih metode pembayaran
                                </h2>
                            </div>

                            <div class="p-6 md:p-8 space-y-8">
                                <div v-if="loadingChannels"
                                    class="flex flex-col items-center justify-center py-12 gap-3">
                                    <div
                                        class="animate-spin size-8 border-2 border-navy border-t-transparent rounded-full">
                                    </div>
                                    <div class="text-[10px] font-black text-gray-400">Memuat...</div>
                                </div>

                                <div v-else-if="channels.length === 0" class="text-center py-12 bg-gray-50 rounded-2xl">
                                    <Icon icon="ph:warning-circle-bold" class="text-4xl text-amber-500 mx-auto mb-3" />
                                    <div class="text-navy font-black text-sm">Metode tidak tersedia</div>
                                </div>

                                <div v-else v-for="(group, name) in groupedChannels" :key="name" class="space-y-4">
                                    <div class="flex items-center gap-3">
                                        <h3 class="text-[10px] font-bold text-gray-400 ml-1">{{ name }}</h3>
                                        <div class="h-px bg-gray-50 flex-1"></div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label v-for="channel in group" :key="channel.code"
                                            class="relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all group"
                                            :class="selectedChannel === channel.code
                                                ? 'border-navy bg-navy/[0.02]'
                                                : 'border-gray-100 bg-gray-50/30 hover:bg-white hover:border-gray-200'">
                                            <input type="radio" v-model="selectedChannel" :value="channel.code"
                                                class="sr-only">

                                            <div class="flex items-center gap-4 w-full">
                                                <div
                                                    class="size-10 bg-white rounded-xl border border-gray-100 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                                                    <img :src="channel.icon_url" :alt="channel.name"
                                                        class="size-full object-contain">
                                                </div>
                                                <div class="flex-grow min-w-0">
                                                    <div
                                                        class="text-[13px] font-black text-navy truncate transition-colors">
                                                        {{ channel.name }}
                                                    </div>
                                                </div>
                                                <div class="shrink-0 size-5 rounded-full border flex items-center justify-center transition-all"
                                                    :class="selectedChannel === channel.code ? 'border-navy bg-navy text-white' : 'border-gray-200 bg-white'">
                                                    <Icon v-if="selectedChannel === channel.code" icon="ph:check-bold"
                                                        class="text-[10px]" />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Payment Instructions -->
                        <section v-if="selectedChannel"
                            class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="p-6 md:p-8 border-b border-gray-50">
                                <h2 class="text-lg font-black text-navy flex items-center gap-3">
                                    <Icon icon="ph:list-checks-bold" class="text-gray-400" />
                                    Cara Pembayaran
                                </h2>
                            </div>
                            <div class="p-6 md:p-8">
                                <div v-if="loadingInstructions" class="flex items-center justify-center py-8 gap-3">
                                    <div class="animate-spin size-6 border-2 border-navy border-t-transparent rounded-full"></div>
                                    <span class="text-xs font-bold text-gray-400">Memuat panduan...</span>
                                </div>
                                <div v-else-if="instructions.length === 0" class="text-center py-8 text-gray-400 text-sm font-bold">
                                    Panduan tidak tersedia untuk metode ini.
                                </div>
                                <div v-else class="space-y-6">
                                    <div v-for="(section, si) in instructions" :key="si" class="space-y-3">
                                        <h3 class="text-sm font-black text-navy">{{ section.title }}</h3>
                                        <ol class="space-y-2">
                                            <li v-for="(step, idx) in section.steps" :key="idx"
                                                class="flex items-start gap-3 text-sm text-gray-600">
                                                <span class="shrink-0 size-5 rounded-full bg-navy text-white text-[10px] font-black flex items-center justify-center mt-0.5">{{ idx + 1 }}</span>
                                                <span class="font-medium leading-snug">{{ step.description }}</span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- Right Column: Order Summary -->
                    <aside class="lg:col-span-4 space-y-6">
                        <div
                            class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
                            <h3 class="text-sm font-black text-navy mb-6 flex items-center gap-2">
                                <Icon icon="ph:receipt-bold" class="text-gray-400" />
                                Ringkasan
                            </h3>

                            <div class="flex gap-4 mb-6 pt-4 border-t border-gray-50">
                                <div
                                    class="size-14 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50 shadow-sm">
                                    <img :src="event?.banner_url || '/hero-event-detail.jpeg'"
                                        class="size-full object-cover">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-[13px] font-black text-navy leading-tight mb-1 line-clamp-2">
                                        {{ event?.name }}</div>
                                    <div class="inline-flex">
                                        <span
                                            class="text-[10px] font-black text-navy bg-navy/5 px-2 py-0.5 rounded whitespace-nowrap">
                                            {{ registration?.category_name || registration?.category || 'General' }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3 mb-6">
                                <div class="flex justify-between items-center text-[10px] font-bold">
                                    <span class="text-gray-400">Registrasi</span>
                                    <span class="text-navy font-black">Rp {{ formatNumber(registration?.payment_amount)
                                    }}</span>
                                </div>
                                <div class="pt-4 border-t border-dashed border-gray-100 mt-4 flex flex-col gap-1">
                                    <div class="flex justify-between items-center">
                                        <span class=" text-xs font-black text-navy">Total Bayar</span>
                                        <span class="text-xl font-black text-navy tracking-tight">Rp {{
                                            formatNumber(totalAmount) }}</span>
                                    </div>
                                    <div v-if="selectedChannelData" class="text-[9px] text-gray-400 font-bold italic">
                                        *Sudah termasuk biaya admin {{ selectedChannelData.name }}
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <BaseButton @click="handlePayment" :disabled="!selectedChannel || loading"
                                    variant="primary" size="lg" block :loading="loading"
                                    class="h-12 !rounded-xl text-sm font-black shadow-sm">
                                    Bayar sekarang
                                </BaseButton>

                                <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div class="flex gap-2">
                                        <Icon icon="ph:shield-check-bold" class="text-navy/20 text-sm shrink-0" />
                                        <div class="text-[9px] text-gray-500 font-bold leading-relaxed italic">
                                            Transaksi aman & terenkripsi. Segera selesaikan pembayaran untuk
                                            mengamankan
                                            slot
                                            Anda.
                                        </div>
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
const { t } = useI18n()
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useDateFormat } from '@vueuse/core'

definePageMeta({
    layout: 'blank'
})

useHead({ title: computed(() => t('payment.event_payment', 'Event Payment') + ' - Archeris') })


const route = useRoute()
const router = useRouter()
const { get } = useApi()
const toast = useToast()
const slug = route.params.slug
const registrationId = route.query.registration_id || route.query.id
const payment = usePayment()

const isLoading = ref(true)
const loadingChannels = ref(true)
const loadingInstructions = ref(false)
const loading = ref(false)
const channels = ref([])
const selectedChannel = ref(null)
const instructions = ref([])
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
    if (!evt.start_date) return evt.date || 'TBA'

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
        console.log(`[DEBUG] Loading payment page for slug: ${slug}, ID: ${registrationId}`)

        // Fetch event details first
        const eventData = await get(`/tournaments/${slug}`)
        event.value = eventData

        // Fetch registration info
        if (registrationId) {
            // Backend handles UUID or Archer ID (e.g. ARC-0001)
            const regData = await get(`/tournaments/${slug}/participants/${registrationId}`)
            registration.value = regData
        } else {
            // If No ID provided, try to fetch current user's registration for this event
            try {
                const regData = await get(`/tournaments/${slug}/participants/me`)
                registration.value = regData
            } catch (err) {
                error.value = 'Data registrasi tidak ditemukan. Silakan masuk melalui dashboard atau pastikan Anda sudah terdaftar.'
            }
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

watch(selectedChannel, async (code) => {
    if (!code) {
        instructions.value = []
        return
    }
    loadingInstructions.value = true
    instructions.value = await payment.getInstruction(code)
    loadingInstructions.value = false
})

const handlePayment = async () => {
    if (!selectedChannel.value || !registration.value?.id) return

    loading.value = true
    try {
        const res = await payment.createParticipantPayment(registration.value.id, selectedChannel.value)

        if (res && res.checkout_url) {
            window.open(res.checkout_url, '_blank')
            if (res.reference) {
                router.push(`/payment/status/${res.reference}`)
            }
        } else if (res && res.reference) {
            router.push(`/payment/status/${res.reference}`)
        }
    } catch (err) {
        console.error('Payment error:', err)
        toast.error(err?.data?.error || 'Gagal memproses pembayaran. Silakan coba lagi.')
    } finally {
        loading.value = false
    }
}
</script>
