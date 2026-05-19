<template>
    <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans antialiased">
        <!-- Header -->
        <header class="bg-white border-b border-slate-200">
            <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-teal-600 flex items-center justify-center">
                        <Icon icon="ph:shield-check-bold" class="text-lg text-white" />
                    </div>
                    <div>
                        <h1 class="text-sm font-bold text-slate-900">ArcheryHub.id</h1>
                        <p class="text-[9px] font-bold text-teal-600 uppercase tracking-wider leading-none">Paddle Sandbox Test</p>
                    </div>
                </div>

                <nuxt-link to="/dashboard/organization/subscription" class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 border border-slate-200">
                    <Icon icon="ph:arrow-left-bold" />
                    Kembali ke Dashboard
                </nuxt-link>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 max-w-6xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Controls Section -->
            <div class="lg:col-span-7 space-y-6">
                <!-- Box 1: Initiate Checkout -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                            <Icon icon="ph:credit-card-bold" class="text-lg" />
                        </div>
                        <div>
                            <h2 class="text-sm font-bold text-slate-900">1. Uji Checkout Paddle</h2>
                            <p class="text-xs text-slate-500">Pilih paket & durasi untuk menginisiasi checkout.</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <!-- Standard Card -->
                        <div @click="selectedPlan = 3" 
                             class="border rounded-xl p-4 cursor-pointer transition-all hover:border-slate-300"
                             :class="selectedPlan === 3 ? 'border-teal-600 bg-teal-50/20 ring-1 ring-teal-600' : 'border-slate-200 bg-white'">
                            <div class="flex justify-between items-center mb-3">
                                <span class="px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-600 rounded">Standard</span>
                                <div class="size-4 rounded-full border flex items-center justify-center"
                                     :class="selectedPlan === 3 ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'">
                                    <Icon v-if="selectedPlan === 3" icon="ph:check-bold" class="text-[9px]" />
                                </div>
                            </div>
                            <h4 class="font-bold text-slate-900 text-sm">Standard EO</h4>
                            <p class="text-xs font-medium text-slate-500 mt-1">Rp 29.999 / bulan</p>
                        </div>

                        <!-- Elite Card -->
                        <div @click="selectedPlan = 4" 
                             class="border rounded-xl p-4 cursor-pointer transition-all hover:border-slate-300"
                             :class="selectedPlan === 4 ? 'border-teal-600 bg-teal-50/20 ring-1 ring-teal-600' : 'border-slate-200 bg-white'">
                            <div class="flex justify-between items-center mb-3">
                                <span class="px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-600 rounded">Elite</span>
                                <div class="size-4 rounded-full border flex items-center justify-center"
                                     :class="selectedPlan === 4 ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'">
                                    <Icon v-if="selectedPlan === 4" icon="ph:check-bold" class="text-[9px]" />
                                </div>
                            </div>
                            <h4 class="font-bold text-slate-900 text-sm">Elite EO</h4>
                            <p class="text-xs font-medium text-slate-500 mt-1">Rp 49.999 / bulan</p>
                        </div>
                    </div>

                    <!-- Duration Selector -->
                    <div class="mb-6">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Durasi Paket (Bulan)</label>
                        <div class="flex gap-2">
                            <button v-for="m in [1, 3, 6, 12]" :key="m" @click="selectedMonths = m"
                                    class="px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors"
                                    :class="selectedMonths === m ? 'border-teal-600 bg-teal-50/30 text-teal-700' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'">
                                {{ m }} Bulan
                            </button>
                        </div>
                    </div>

                    <button @click="testCheckout" :disabled="loadingCheckout"
                            class="w-full h-11 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <Icon v-if="loadingCheckout" icon="ph:spinner-gap-bold" class="animate-spin text-sm" />
                        <template v-else>
                            Luncurkan Checkout URL
                            <Icon icon="ph:arrow-square-out-bold" />
                        </template>
                    </button>
                </div>

                <!-- Box 2: Webhook Callback Simulator -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                            <Icon icon="ph:code-bold" class="text-lg" />
                        </div>
                        <div>
                            <h2 class="text-sm font-bold text-slate-900">2. Simulator Webhook Callback</h2>
                            <p class="text-xs text-slate-500">Kirim event simulasi selesai langsung ke backend local.</p>
                        </div>
                    </div>

                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Merchant Reference</label>
                            <input v-model="simRef" type="text" placeholder="Masukkan Reference (Contoh: PAY-PADDLE-xxxxxx)" 
                                   class="w-full h-10 bg-slate-50 border border-slate-200 focus:border-teal-600 rounded-lg px-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-colors" />
                        </div>
                    </div>

                    <div class="p-3.5 bg-blue-50 border border-blue-100 rounded-xl mb-6 text-[10px] font-semibold text-blue-700 flex gap-2.5">
                        <Icon icon="ph:info-bold" class="text-sm shrink-0" />
                        <span>Info: Simulasi langsung memicu update langganan ke database lewat simulate-success route local.</span>
                    </div>

                    <button @click="testWebhook" :disabled="loadingWebhook"
                            class="w-full h-11 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <Icon v-if="loadingWebhook" icon="ph:spinner-gap-bold" class="animate-spin text-sm" />
                        <template v-else>
                            Simulasikan Webhook Sukses
                            <Icon icon="ph:paper-plane-right-bold" />
                        </template>
                    </button>
                </div>
            </div>

            <!-- Terminal Output Section -->
            <div class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[520px] shadow-sm sticky top-6">
                <!-- Header -->
                <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-700 tracking-wider">Aktivitas & Output Logs</span>
                    <button @click="clearLogs" class="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5">
                        <Icon icon="ph:trash-bold" />
                        Bersihkan
                    </button>
                </div>

                <!-- Logs Area -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] leading-relaxed text-slate-600">
                    <div v-if="logs.length === 0" class="text-slate-400 italic">
                        Belum ada aktivitas pengujian...
                    </div>
                    <div v-else v-for="(log, idx) in logs" :key="idx" 
                         :class="['p-2.5 rounded-lg border', log.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : log.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-700 border-slate-100']">
                        <div class="flex items-center justify-between text-[8px] text-slate-400 mb-1 font-sans font-semibold uppercase tracking-wider">
                            <span>{{ log.time }}</span>
                            <span>{{ log.tag }}</span>
                        </div>
                        <p class="whitespace-pre-wrap font-medium">{{ log.message }}</p>
                    </div>
                </div>
            </div>

        </main>

        <!-- Footer -->
        <footer class="border-t border-slate-200 bg-white py-4 text-center text-[10px] font-semibold text-slate-400 tracking-wider">
            ArcheryHub.id &bull; Paddle Sandbox Developer Tool
        </footer>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'

definePageMeta({
    layout: false
})

const apiBaseUrl = useApiBaseUrl()
const selectedPlan = ref(3)
const selectedMonths = ref(1)
const simRef = ref('')
const loadingCheckout = ref(false)
const loadingWebhook = ref(false)
const logs = ref([])

const addLog = (tag, message, type = 'info') => {
    const time = new Date().toLocaleTimeString('id-ID')
    logs.value.push({ time, tag, message, type })
}

const clearLogs = () => {
    logs.value = []
}

onMounted(() => {
    addLog('system', 'Inisialisasi sistem pengujian API Sandbox...', 'info')
    addLog('system', 'Siap meluncurkan checkout & simulasi callback.', 'success')

    const route = useRoute()
    if (route.query.ref) {
        simRef.value = route.query.ref
        addLog('system', `reference terdeteksi dari url: ${route.query.ref}`, 'success')
        addLog('system', 'silakan klik tombol "simulasikan webhook sukses" di bawah untuk memproses.', 'info')
    }
})

const testCheckout = async () => {
    loadingCheckout.value = true
    addLog('api-req', `Membuat transaksi pending... Plan: ${selectedPlan.value}, Bulan: ${selectedMonths.value}`, 'info')
    
    try {
        const res = await $fetch(`${apiBaseUrl}/payment/paddle/initiate`, {
            method: 'POST',
            body: {
                plan_id: selectedPlan.value,
                months: selectedMonths.value
            },
            credentials: 'include'
        })
        
        addLog('api-res', `Berhasil! Reference: ${res.reference} | Total: Rp ${res.total_amount.toLocaleString('id-ID')}`, 'success')
        
        // Populate simulator field immediately for convenience
        simRef.value = res.reference

        if (res.checkout_url && res.checkout_url.includes('txn_mock_')) {
            addLog('system', 'mode mock/offline terdeteksi (tidak ada paddle api key).', 'info')
            addLog('system', `tidak membuka tab baru karena transaction_id adalah mock (${res.checkout_url}).`, 'warning')
            addLog('system', 'silakan klik tombol "simulasikan webhook sukses" di bawah untuk menyelesaikan pembayaran.', 'success')
        } else {
            if (window.Paddle && res.tripay_reference) {
                addLog('redirect', 'Membuka secure overlay checkout Paddle via Paddle.js...', 'info')
                window.Paddle.Checkout.open({
                    transactionId: res.tripay_reference
                })
            } else {
                addLog('redirect', `Membuka secure hosted checkout Paddle di tab baru...`, 'info')
                window.open(res.checkout_url, '_blank')
            }
        }
        
    } catch (err) {
        addLog('error', `Gagal: ${err.data?.error || err.message}`, 'error')
    } finally {
        loadingCheckout.value = false
    }
}

const testWebhook = async () => {
    if (!simRef.value) {
        addLog('validation', 'Merchant Reference tidak boleh kosong!', 'error')
        return
    }
    
    loadingWebhook.value = true
    addLog('webhook-sim', `Memicu webhook completion untuk reference: ${simRef.value}...`, 'info')
    
    try {
        const res = await $fetch(`${apiBaseUrl}/payment/simulate-success/${simRef.value}`, {
            method: 'GET',
            credentials: 'include'
        })
        addLog('webhook-sim', `Sukses! Callback berhasil diproses. Langganan diperpanjang!`, 'success')
    } catch (err) {
        addLog('error', `Simulasi Gagal: ${err.data?.error || err.message}`, 'error')
    } finally {
        loadingWebhook.value = false
    }
}
</script>

<style>
/* Clean scrollbars for logs container */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}
</style>
