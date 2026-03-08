<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-20">
        <!-- Header -->
        <div class="bg-navy relative overflow-hidden py-8">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-navy/90 z-10"></div>
                <img :src="tournament.image" class="w-full h-full object-cover opacity-30 mix-blend-overlay" />
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-white text-3xl font-black tracking-tight">Metode Pembayaran</h1>
            </div>
        </div>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 -mt-4 relative z-30">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                <div class="lg:col-span-2 space-y-6">
                    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6 border-b border-gray-100">
                            <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                <span
                                    class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-xs">2</span>
                                Pilih Pembayaran
                            </h2>
                        </div>

                        <div class="p-6 md:p-8 space-y-8">
                            <div v-if="loadingChannels" class="flex justify-center py-10">
                                <div class="animate-spin material-symbols-outlined text-4xl text-primary">sync</div>
                            </div>

                            <div v-else v-for="(group, name) in groupedChannels" :key="name" class="space-y-4">
                                <h3 class="text-xs font-bold text-gray-400  tracking-wider ml-1">{{ name }}
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label v-for="channel in group" :key="channel.code"
                                        class="relative flex items-center p-4 border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                                        :class="selectedChannel === channel.code ? 'border-primary bg-primary/5' : 'border-gray-100'">
                                        <input type="radio" v-model="selectedChannel" :value="channel.code"
                                            class="sr-only">
                                        <div class="flex items-center gap-4 w-full">
                                            <div
                                                class="w-12 h-12 bg-white rounded border border-gray-100 p-2 flex items-center justify-center shrink-0">
                                                <img :src="channel.icon_url" :alt="channel.name"
                                                    class="max-w-full max-h-full object-contain">
                                            </div>
                                            <div class="flex-grow">
                                                <p
                                                    class="text-sm font-bold text-navy group-hover:text-primary transition-colors">
                                                    {{ channel.name }}</p>
                                                <p class="text-[10px] text-gray-500">Biaya: IDR {{
                                                    channel.total_fee.toLocaleString() }}</p>
                                            </div>
                                            <div v-if="selectedChannel === channel.code" class="text-primary">
                                                <span class="material-symbols-outlined text-xl">check_circle</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="p-6 md:p-8 pt-0">
                            <button @click="handlePayment" :disabled="!selectedChannel || loading"
                                class="w-full py-4 bg-primary hover:bg-primary-hover text-navy font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="loading" class="animate-spin material-symbols-outlined">sync</span>
                                <span v-else class="material-symbols-outlined">lock</span>
                                Bayar Sekarang
                            </button>
                        </div>
                    </section>
                </div>

                <!-- Order Summary -->
                <aside class="space-y-6">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <h3 class="text-lg font-bold text-navy mb-4">Ringkasan Pesanan</h3>
                        <div class="flex gap-4 mb-6 pt-4 border-t border-gray-100">
                            <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                <img :src="tournament.image" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <p class="text-sm font-bold text-navy line-clamp-2">{{ tournament.name }}</p>
                                <p class="text-xs text-gray-500">{{ registration?.division }} - {{
                                    registration?.category }}</p>
                            </div>
                        </div>

                        <div class="space-y-3 mb-6">
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-500">Biaya Pendaftaran</span>
                                <span class="font-bold text-navy">IDR {{ (registration?.payment_amount ||
                                    0).toLocaleString() }}</span>
                            </div>
                            <div v-if="selectedChannelData" class="flex justify-between items-center text-sm">
                                <span class="text-gray-500">Biaya Transaksi ({{ selectedChannelData.name }})</span>
                                <span class="font-bold text-navy text-primary">+ IDR {{
                                    (totalAmount - (registration?.payment_amount || 0)).toLocaleString() }}</span>
                            </div>
                            <div class="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span class="text-base font-bold text-navy">Total Bayar</span>
                                <span class="text-xl font-black text-primary">IDR {{ totalAmount.toLocaleString()
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const router = useRouter()
const { get } = useApi()
const slug = route.params.slug
const registrationId = route.query.registration_id
const payment = usePayment()

const loadingChannels = ref(true)
const loading = ref(false)
const channels = ref([])
const selectedChannel = ref(null)
const registration = ref(null)
const event = ref(null)

const tournament = computed(() => ({
    name: event.value?.name || 'Loading event...',
    image: event.value?.banner_url || ''
}))

onMounted(async () => {
    try {
        // Fetch channels
        channels.value = await payment.getChannels()
        loadingChannels.value = false

        // Fetch registration & event info
        if (registrationId) {
            const regData = await get(`/events/${slug}/participants/${registrationId}`)
            registration.value = regData

            // Also fetch event details for the name/image
            const eventData = await get(`/events/${slug}`)
            event.value = eventData
        }
    } catch (err) {
        console.error('Failed to load payment data:', err)
    }
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
    let baseAmount = registration.value?.payment_amount || 0
    if (selectedChannelData.value) {
        // Tripay documentation: total = (amount + flat) / (1 - percent/100)
        // For simplicity we just add the fee returned by API if it's already pre-calculated
        // but often we need to calculate it.
        const feeFlat = selectedChannelData.value.fee_customer?.flat || 0
        const feePercent = selectedChannelData.value.fee_customer?.percent || 0

        let total = baseAmount + feeFlat
        if (feePercent > 0) {
            total = total / (1 - (feePercent / 100))
        }
        return Math.ceil(total)
    }
    return baseAmount
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
    } catch (error) {
        console.error('Payment error:', error)
        alert('Gagal memproses pembayaran. Silakan coba lagi.')
    } finally {
        loading.value = false
    }
}
</script>
