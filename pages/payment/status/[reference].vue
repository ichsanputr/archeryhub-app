<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-20">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                <div class="animate-spin material-symbols-outlined text-5xl text-primary mb-4">sync</div>
                <p class="text-gray-500 font-bold">Memuat data pembayaran...</p>
            </div>

            <div v-else-if="transaction" class="space-y-6">
                <!-- Success/Status Banner -->
                <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center space-y-4">
                    <div v-if="transaction.status === 'paid'"
                        class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <div v-else-if="transaction.status === 'pending'"
                        class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="material-symbols-outlined text-4xl">payments</span>
                    </div>
                    <div v-else
                        class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="material-symbols-outlined text-4xl">error</span>
                    </div>

                    <h1 class="text-2xl font-black text-navy">
                        {{ statusText }}
                    </h1>
                    <p class="text-gray-500 text-sm max-w-sm mx-auto">
                        {{ statusDescription }}
                    </p>

                    <div v-if="transaction.status === 'pending'" class="bg-navy/5 rounded-xl p-4 inline-block">
                        <p class="text-xs text-gray-500  font-bold tracking-widest mb-1">Batas Waktu Pembayaran
                        </p>
                        <p class="text-xl font-black text-navy">{{ timeLeft }}</p>
                    </div>
                </div>

                <!-- Payment Details -->
                <div v-if="transaction.status === 'pending'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div
                        class="p-6 border-b border-gray-100 bg-gray-50 font-bold text-navy flex items-center justify-between">
                        <span>Rincian Pembayaran</span>
                        <span class="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{{ transaction.payment_method
                        }}</span>
                    </div>

                    <div class="p-6 md:p-8 space-y-8 text-center">
                        <!-- QRIS -->
                        <div v-if="transaction.qr_url" class="space-y-4">
                            <p class="text-sm font-bold text-gray-500">Scan QR Code di bawah ini:</p>
                            <div class="bg-white p-4 inline-block border-2 border-dashed border-gray-200 rounded-2xl">
                                <img :src="transaction.qr_url" alt="QR Code" class="w-64 h-64 object-contain">
                            </div>
                            <p class="text-xs text-gray-400">Gunakan aplikasi e-wallet atau mobile banking favorit Anda
                            </p>
                        </div>

                        <!-- VA Number / Pay Code -->
                        <div v-if="transaction.pay_code || transaction.va_number" class="space-y-4">
                            <p class="text-sm font-bold text-gray-500">Nomor Virtual Account / Kode Bayar:</p>
                            <div class="flex items-center justify-center gap-4">
                                <span class="text-3xl font-black text-navy tracking-widest">{{ transaction.pay_code ||
                                    transaction.va_number }}</span>
                                <button @click="copyToClipboard(transaction.pay_code || transaction.va_number)"
                                    class="p-2 hover:bg-gray-100 rounded-lg text-primary transition-colors">
                                    <span class="material-symbols-outlined">content_copy</span>
                                </button>
                            </div>
                        </div>

                        <div class="py-6 border-t border-dashed border-gray-200">
                            <p class="text-sm font-bold text-gray-500 mb-2">Total yang harus dibayar:</p>
                            <p class="text-4xl font-black text-primary">IDR {{ transaction.total_amount.toLocaleString()
                            }}</p>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-4">
                    <NuxtLink to="/dashboard"
                        class="flex-1 py-4 bg-white border border-gray-200 text-navy font-bold rounded-xl text-center hover:bg-gray-50 transition-colors shadow-sm">
                        Ke Dashboard
                    </NuxtLink>
                    <button v-if="transaction.status === 'pending'" @click="checkStatus"
                        class="flex-1 py-4 bg-primary text-navy font-bold rounded-xl text-center hover:bg-primary-hover transition-colors shadow-md">
                        Saya Sudah Bayar
                    </button>
                </div>

                <!-- Support -->
                <div class="text-center pt-8">
                    <p class="text-sm text-gray-400">Butuh bantuan? <NuxtLink to="/contact"
                            class="text-navy font-bold hover:underline">Hubungi Support</NuxtLink>
                    </p>
                </div>
            </div>

            <div v-else class="text-center py-20">
                <h2 class="text-xl font-bold text-navy mb-4">Transaksi tidak ditemukan</h2>
                <NuxtLink to="/events" class="text-primary font-bold hover:underline">Kembali ke Turnamen
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'landing'
})

const route = useRoute()

const reference = route.params.reference
const payment = usePayment()

const loading = ref(true)
const transaction = ref(null)
const timeLeft = ref('00:00:00')

const statusText = computed(() => {
    if (!transaction.value) return ''
    switch (transaction.value.status) {
        case 'paid': return 'Pembayaran Berhasil'
        case 'pending': return 'Menunggu Pembayaran'
        case 'expired': return 'Pembayaran Kedaluwarsa'
        case 'failed': return 'Pembayaran Gagal'
        default: return 'Status Tidak Diketahui'
    }
})

const statusDescription = computed(() => {
    if (!transaction.value) return ''
    switch (transaction.value.status) {
        case 'paid': return 'Terima kasih! Pembayaran Anda telah kami terima. Anda sekarang terdaftar secara resmi di turnamen.'
        case 'pending': return 'Segera selesaikan pembayaran Anda sebelum batas waktu berakhir untuk mengamankan slot pertandingan.'
        case 'expired': return 'Mohon maaf, batas waktu pembayaran telah habis. Silakan lakukan pendaftaran ulang.'
        case 'failed': return 'Terjadi kesalahan pada transaksi Anda. Silakan coba lagi atau gunakan metode pembayaran lain.'
        default: return ''
    }
})

onMounted(async () => {
    await fetchTransaction()
    if (transaction.value?.status === 'pending') {
        startTimer()
    }
})

const fetchTransaction = async () => {
    try {
        transaction.value = await payment.getPaymentStatus(reference)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const checkStatus = async () => {
    loading.value = true
    await fetchTransaction()
    if (transaction.value.status === 'paid') {
        alert('Pembayaran terverifikasi!')
    } else {
        alert('Pembayaran belum diterima. Mohon tunggu beberapa saat atau cek kembali bukti transfer Anda.')
    }
    loading.value = false
}

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Disalin ke papperboard')
}

const startTimer = () => {
    const expiry = new Date(transaction.value.expired_at).getTime()

    const update = () => {
        const now = new Date().getTime()
        const diff = expiry - now

        if (diff <= 0) {
            timeLeft.value = '00:00:00'
            transaction.value.status = 'expired'
            return
        }

        const h = Math.floor(diff / (1000 * 60 * 60))
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const s = Math.floor((diff % (1000 * 60)) / 1000)

        timeLeft.value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        setTimeout(update, 1000)
    }

    update()
}

useSeoMeta({
    title: 'Status Pembayaran - Archeryhub.id'
})
</script>
