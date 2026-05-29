<template>
    <div class="space-y-8">
        <!-- Breadcrumb & Header -->
        <div class="flex flex-col gap-6">
            <nav class="flex flex-wrap gap-2 items-center">
                <NuxtLink to="/dashboard"
                    class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">Dashboard
                </NuxtLink>
                <span class="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
                <NuxtLink :to="`/dashboard/${userPersona}/events`"
                    class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">Events
                </NuxtLink>
                <span class="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
                <span class="text-navy text-sm font-bold">Pembayaran</span>
            </nav>

            <div class="flex flex-col gap-3">
                <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Pembayaran Biaya Platform</h1>
                <p class="text-text-secondary text-sm md:text-base font-medium max-w-2xl">
                    Selesaikan pembayaran untuk mengaktifkan event Anda dan mulai menerima pendaftaran peserta.
                </p>
            </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Payment Channels -->
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">credit_card</span>
                        Pilih Metode Pembayaran
                    </h2>

                    <!-- Loading State -->
                    <div v-if="isLoadingChannels" class="flex items-center justify-center py-12">
                        <span class="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                    </div>

                    <!-- Channel Groups -->
                    <div v-else class="space-y-6">
                        <!-- Virtual Account -->
                        <div v-if="channelGroups.va?.length">
                            <h3 class="text-sm font-bold text-gray-500  tracking-wider mb-3">Virtual Account
                            </h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <button v-for="channel in channelGroups.va" :key="channel.code"
                                    @click="selectChannel(channel)"
                                    :class="selectedChannel?.code === channel.code ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-gray-200 hover:border-gray-300'"
                                    class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group">
                                    <img :src="channel.icon_url" :alt="channel.name" class="h-8 object-contain" />
                                    <span class="text-xs font-semibold text-navy">{{ channel.name }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- E-Wallet -->
                        <div v-if="channelGroups.ewallet?.length">
                            <h3 class="text-sm font-bold text-gray-500  tracking-wider mb-3">E-Wallet</h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <button v-for="channel in channelGroups.ewallet" :key="channel.code"
                                    @click="selectChannel(channel)"
                                    :class="selectedChannel?.code === channel.code ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-gray-200 hover:border-gray-300'"
                                    class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group">
                                    <img :src="channel.icon_url" :alt="channel.name" class="h-8 object-contain" />
                                    <span class="text-xs font-semibold text-navy">{{ channel.name }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Convenience Store -->
                        <div v-if="channelGroups.cstore?.length">
                            <h3 class="text-sm font-bold text-gray-500  tracking-wider mb-3">Convenience Store
                            </h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <button v-for="channel in channelGroups.cstore" :key="channel.code"
                                    @click="selectChannel(channel)"
                                    :class="selectedChannel?.code === channel.code ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-gray-200 hover:border-gray-300'"
                                    class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group">
                                    <img :src="channel.icon_url" :alt="channel.name" class="h-8 object-contain" />
                                    <span class="text-xs font-semibold text-navy">{{ channel.name }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
                <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">receipt_long</span>
                        Ringkasan Pembayaran
                    </h2>

                    <div class="space-y-4 mb-6">
                        <div class="flex justify-between py-2 border-b border-gray-100">
                            <span class="text-gray-500">Biaya Platform</span>
                            <span class="font-semibold text-navy">Rp 50.000</span>
                        </div>
                        <div v-if="selectedChannel" class="flex justify-between py-2 border-b border-gray-100">
                            <span class="text-gray-500">Biaya Admin</span>
                            <span class="font-semibold text-navy">Rp {{
                                selectedChannel.total_fee?.flat?.toLocaleString('id-ID') || '0' }}</span>
                        </div>
                        <div class="flex justify-between py-3 text-lg">
                            <span class="font-bold text-navy">Total</span>
                            <span class="font-black text-primary">Rp {{ totalAmount.toLocaleString('id-ID') }}</span>
                        </div>
                    </div>

                    <button @click="createPayment" :disabled="!selectedChannel || isProcessing"
                        class="w-full h-12 rounded-xl bg-navy-dark text-white font-bold hover:bg-navy-light transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isProcessing" class="material-symbols-outlined animate-spin">sync</span>
                        <span>{{ isProcessing ? 'Memproses...' : 'Bayar Sekarang' }}</span>
                    </button>

                    <p class="text-xs text-gray-500 text-center mt-4">
                        Dengan melanjutkan, Anda menyetujui <NuxtLink to="#" class="text-primary hover:underline">syarat
                            dan
                            ketentuan</NuxtLink> kami.
                    </p>
                </div>
            </div>
        </div>

        <!-- Payment Instructions Modal -->
        <AppDialog v-model:show="showInstructionsDialog" title="Instruksi Pembayaran" type="primary" icon="payments">
            <template #default>
                <div class="space-y-4">
                    <div v-if="paymentData?.pay_code" class="bg-gray-50 rounded-xl p-4 text-center">
                        <p class="text-xs text-gray-500  font-bold mb-2">Kode Pembayaran / VA</p>
                        <p class="text-2xl font-black text-navy tracking-widest">{{ paymentData.pay_code }}</p>
                    </div>
                    <div v-if="paymentData?.qr_url" class="flex justify-center">
                        <img :src="paymentData.qr_url" alt="QR Code" class="w-48 h-48 rounded-xl border" />
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-500">Total Bayar</span>
                        <span class="font-bold text-navy">Rp {{ paymentData?.total_amount?.toLocaleString('id-ID') ||
                            '0' }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-500">Batas Waktu</span>
                        <span class="font-semibold text-amber-600">{{ formatExpiry(paymentData?.expired_at) }}</span>
                    </div>
                </div>
            </template>
        </AppDialog>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Pembayaran - Dashboard'
})

const route = useRoute()
const { get, post } = useApi()

const tournamentId = route.params.id
const channels = ref([])
const selectedChannel = ref(null)
const isLoadingChannels = ref(true)
const isProcessing = ref(false)
const showInstructionsDialog = ref(false)
const paymentData = ref(null)

const platformFee = 50000

const channelGroups = computed(() => {
    const groups = { va: [], ewallet: [], cstore: [] }
    channels.value.forEach(ch => {
        if (ch.group === 'Virtual Account') groups.va.push(ch)
        else if (ch.group === 'E-Wallet') groups.ewallet.push(ch)
        else if (ch.group === 'Convenience Store') groups.cstore.push(ch)
    })
    return groups
})

const totalAmount = computed(() => {
    const adminFee = selectedChannel.value?.total_fee?.flat || 0
    return platformFee + adminFee
})

const selectChannel = (channel) => {
    selectedChannel.value = channel
}

const formatExpiry = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('id-ID')
}

const createPayment = async () => {
    if (!selectedChannel.value) return

    isProcessing.value = true
    try {
        // For now, we'll create a simple platform fee payment
        // This would need a dedicated endpoint for org platform fees
        const result = await post('/payment/create', {
            tournament_id: tournamentId,
            method: selectedChannel.value.code,
            amount: totalAmount.value,
            type: 'platform_fee'
        })

        if (result) {
            paymentData.value = result
            showInstructionsDialog.value = true
        }
    } catch (error) {
        console.error('Payment creation failed:', error)
    } finally {
        isProcessing.value = false
    }
}

onMounted(async () => {
    try {
        const result = await get('/payment/channels')
        channels.value = result || []
    } catch (error) {
        console.error('Failed to load payment channels:', error)
    } finally {
        isLoadingChannels.value = false
    }
})
</script>
