<template>
    <div
        class="min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#111827] to-[#0a0f1e] flex flex-col text-white select-none">

        <!-- ── Header ── -->
        <div class="safe-area-top bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
            <div class="px-4 py-4 flex items-center justify-between">
                <button @click="goBack"
                    class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95">
                    <Icon icon="ph:arrow-left-bold" class="text-white text-xl" />
                </button>
                <div class="text-center">
                    <h1 class="text-white font-black text-base tracking-tight">Scan QR Code</h1>
                    <p class="text-white/50 text-xs font-medium">Daftar Ulang Peserta</p>
                </div>
                <!-- Camera toggle -->
                <button @click="toggleCamera"
                    class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95"
                    :title="isCameraActive ? 'Matikan Kamera' : 'Nyalakan Kamera'">
                    <Icon :icon="isCameraActive ? 'ph:camera-slash-bold' : 'ph:camera-bold'"
                        class="text-white text-xl" />
                </button>
            </div>
        </div>

        <!-- ── Main Content ── -->
        <div class="flex-1 flex flex-col items-center justify-start p-4 pt-6 gap-6">

            <!-- Scanner Card -->
            <div class="w-full max-w-sm">
                <!-- Camera viewport -->
                <div class="relative rounded-3xl overflow-hidden shadow-2xl"
                    style="box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px rgba(0,0,0,0.6);">

                    <!-- Video -->
                    <div class="relative bg-black aspect-square">
                        <video ref="videoElement" class="w-full h-full object-cover" autoplay playsinline muted>
                        </video>

                        <!-- No-camera placeholder -->
                        <div v-if="!isCameraActive"
                            class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 gap-3">
                            <div class="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Icon icon="ph:camera-slash" class="text-4xl text-white/40" />
                            </div>
                            <p class="text-white/50 text-sm font-medium">Kamera tidak aktif</p>
                            <button @click="startCamera"
                                class="px-4 py-2 bg-primary text-navy text-sm font-black rounded-xl hover:brightness-110 transition-all">
                                Nyalakan Kamera
                            </button>
                        </div>

                        <!-- Processing overlay -->
                        <div v-if="isProcessing"
                            class="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                            <div
                                class="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin">
                            </div>
                            <p class="text-white font-bold text-sm">Memverifikasi...</p>
                        </div>

                        <!-- Scan frame overlay (only when camera active & not processing) -->
                        <template v-if="isCameraActive && !isProcessing">
                            <!-- Dark vignette -->
                            <div class="absolute inset-0 pointer-events-none"
                                style="background: radial-gradient(circle at center, transparent 38%, rgba(0,0,0,0.55) 70%);">
                            </div>

                            <!-- Corner brackets -->
                            <div class="abs-bracket top-[22%] left-[22%] border-t-4 border-l-4 rounded-tl-2xl"></div>
                            <div class="abs-bracket top-[22%] right-[22%] border-t-4 border-r-4 rounded-tr-2xl"></div>
                            <div class="abs-bracket bottom-[22%] left-[22%] border-b-4 border-l-4 rounded-bl-2xl"></div>
                            <div class="abs-bracket bottom-[22%] right-[22%] border-b-4 border-r-4 rounded-br-2xl">
                            </div>

                            <!-- Animated scanning beam -->
                            <div class="scan-beam" :class="{ paused: !isCameraActive }"></div>
                        </template>
                    </div>

                    <!-- Status bar below video -->
                    <div class="bg-black/80 backdrop-blur-sm px-4 py-3 flex items-center justify-center gap-2">
                        <div :class="isCameraActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'"
                            class="h-2 w-2 rounded-full"></div>
                        <span class="text-xs font-bold text-white/70">
                            {{ isCameraActive ? 'Kamera aktif — arahkan ke QR Code' : 'Kamera tidak aktif' }}
                        </span>
                    </div>
                </div>

                <!-- Hint -->
                <p class="text-white/40 text-xs text-center mt-4 leading-relaxed">
                    Pastikan QR Code terlihat jelas dalam bingkai.<br>
                    Scan otomatis setiap 300ms.
                </p>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-3 w-full max-w-sm">
                <div class="flex-1 h-px bg-white/10"></div>
                <span class="text-white/30 text-xs font-bold uppercase tracking-widest">atau</span>
                <div class="flex-1 h-px bg-white/10"></div>
            </div>

            <!-- Manual Input -->
            <div class="w-full max-w-sm">
                <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <p class="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Input Manual</p>
                    <div class="flex gap-2">
                        <input v-model="manualInput" type="text" placeholder="Paste kode QR di sini..."
                            class="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 font-medium focus:outline-none focus:border-primary/60 focus:bg-white/15 transition-all"
                            @keyup.enter="submitManual" />
                        <button @click="submitManual" :disabled="!manualInput.trim() || isProcessing"
                            class="px-4 py-2.5 bg-primary text-navy font-black rounded-xl text-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <Icon icon="ph:paper-plane-tilt-bold" class="text-base" />
                        </button>
                    </div>
                </div>
            </div>

        </div>

        <!-- Hidden canvas -->
        <canvas ref="canvasElement" class="hidden"></canvas>

        <!-- ════════════════════════════════════
             SUCCESS DIALOG  — z-index: 9999
             ════════════════════════════════════ -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="scanSuccess" class="fixed inset-0 flex items-center justify-center p-6"
                style="z-index: 9999; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);">

                <Transition enter-active-class="transition duration-300 ease-out delay-100"
                    enter-from-class="opacity-0 scale-90 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0">
                    <div v-if="scanSuccess"
                        class="w-full max-w-sm bg-gradient-to-b from-[#0d2b1e] to-[#07170f] border border-green-500/30 rounded-3xl p-8 shadow-2xl text-center"
                        style="box-shadow: 0 0 60px rgba(34,197,94,0.2);">

                        <!-- Icon -->
                        <div
                            class="h-24 w-24 rounded-full bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center mx-auto mb-5 animate-bounce-once">
                            <Icon icon="ph:check-circle-fill" class="text-6xl text-green-400" />
                        </div>

                        <h2 class="text-2xl font-black text-white mb-1">Registrasi Berhasil!</h2>
                        <p class="text-green-300 text-sm font-medium mb-6">{{ formatTime(new Date()) }}</p>

                        <!-- Participant info card -->
                        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left space-y-2">
                            <div class="flex items-center gap-3 pb-2 border-b border-white/10">
                                <div
                                    class="h-10 w-10 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center shrink-0">
                                    <Icon icon="ph:user-bold" class="text-green-400 text-lg" />
                                </div>
                                <div>
                                    <p class="font-black text-white text-sm leading-tight">{{ participantData?.full_name
                                        }}</p>
                                    <p class="text-white/40 text-xs">{{ participantData?.club_name || 'Individual' }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center justify-between pt-1">
                                <span class="text-white/50 text-xs font-medium">Kategori</span>
                                <span class="text-white text-xs font-bold">{{ getCategoryDisplay(participantData)
                                    }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-white/50 text-xs font-medium">Event</span>
                                <span class="text-white text-xs font-bold truncate max-w-[160px]">{{
                                    participantData?.event_name
                                    }}</span>
                            </div>
                        </div>

                        <button @click="resetScanner"
                            class="w-full py-3.5 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl text-sm transition-all active:scale-95 shadow-lg shadow-green-500/30">
                            <Icon icon="ph:qr-code-bold" class="mr-2" />
                            Scan Berikutnya
                        </button>
                    </div>
                </Transition>
            </div>
        </Transition>

        <!-- ════════════════════════════════════
             ERROR DIALOG  — z-index: 9999
             ════════════════════════════════════ -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="scanError" class="fixed inset-0 flex items-center justify-center p-6"
                style="z-index: 9999; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);">

                <Transition enter-active-class="transition duration-300 ease-out delay-100"
                    enter-from-class="opacity-0 scale-90 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0">
                    <div v-if="scanError"
                        class="w-full max-w-sm bg-gradient-to-b from-[#2b0d0d] to-[#170707] border border-red-500/30 rounded-3xl p-8 shadow-2xl text-center"
                        style="box-shadow: 0 0 60px rgba(239,68,68,0.2);">

                        <!-- Icon -->
                        <div
                            class="h-24 w-24 rounded-full bg-red-500/20 border-2 border-red-400/40 flex items-center justify-center mx-auto mb-5">
                            <Icon icon="ph:x-circle-fill" class="text-6xl text-red-400" />
                        </div>

                        <h2 class="text-2xl font-black text-white mb-2">Registrasi Gagal</h2>
                        <p class="text-red-300/80 text-sm leading-relaxed mb-6 max-w-[260px] mx-auto">{{ errorMessage }}
                        </p>

                        <div class="flex gap-3">
                            <button @click="resetScanner"
                                class="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl text-sm transition-all active:scale-95 border border-white/10">
                                Coba Lagi
                            </button>
                            <button @click="goBack"
                                class="flex-1 py-3.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-black rounded-2xl text-sm transition-all active:scale-95 border border-red-500/20">
                                Kembali
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import jsQR from 'jsqr'
import { definePageMeta, useHead } from '#imports'

definePageMeta({ layout: false })
useHead({ title: 'Scan QR Code — ArcheryHub' })

const router = useRouter()
const { post } = useApi()

const videoElement = ref(null)
const canvasElement = ref(null)
const stream = ref(null)
const scanningInterval = ref(null)
const isCameraActive = ref(false)

const isProcessing = ref(false)
const scanSuccess = ref(false)
const scanError = ref(false)
const errorMessage = ref('')
const participantData = ref(null)
const manualInput = ref('')

const goBack = () => router.back()

// ── Camera ──────────────────────────────────────────────
const startCamera = async () => {
    try {
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 1280 }
            }
        }
        stream.value = await navigator.mediaDevices.getUserMedia(constraints)
        videoElement.value.srcObject = stream.value
        isCameraActive.value = true

        // Wait for metadata then start scanning
        videoElement.value.onloadedmetadata = () => {
            videoElement.value.play().catch(() => { })
            startScanning()
        }
    } catch (err) {
        console.error('Camera error:', err)
        errorMessage.value = 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.'
        scanError.value = true
    }
}

const stopCamera = () => {
    stopScanning()
    if (stream.value) {
        stream.value.getTracks().forEach(t => t.stop())
        stream.value = null
    }
    isCameraActive.value = false
}

const toggleCamera = () => {
    isCameraActive.value ? stopCamera() : startCamera()
}

// ── Scanning ─────────────────────────────────────────────
const startScanning = () => {
    stopScanning() // prevent duplicate intervals
    scanningInterval.value = setInterval(() => {
        if (isProcessing.value || scanSuccess.value || scanError.value) return

        const video = videoElement.value
        const canvas = canvasElement.value
        if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
        })

        if (code?.data) handleQRDetected(code.data)
    }, 300)
}

const stopScanning = () => {
    if (scanningInterval.value) {
        clearInterval(scanningInterval.value)
        scanningInterval.value = null
    }
}

// ── QR Detected ──────────────────────────────────────────
const handleQRDetected = async (qrData) => {
    if (isProcessing.value) return
    isProcessing.value = true
    stopScanning()

    try {
        const response = await post('/events/participants/reregister', { qr_raw: qrData })

        if (response?.success) {
            participantData.value = response.participant
            scanSuccess.value = true
            if (navigator.vibrate) navigator.vibrate([100, 50, 100])
        } else {
            throw new Error(response?.message || 'Registrasi gagal')
        }
    } catch (err) {
        console.error('Scan error:', err)
        errorMessage.value = err.response?.data?.error
            || err.data?.error
            || err.message
            || 'QR Code tidak valid atau peserta tidak ditemukan.'
        scanError.value = true
        if (navigator.vibrate) navigator.vibrate(300)
    } finally {
        isProcessing.value = false
    }
}

// ── Manual Input ─────────────────────────────────────────
const submitManual = () => {
    const val = manualInput.value.trim()
    if (!val || isProcessing.value) return
    manualInput.value = ''
    handleQRDetected(val)
}

// ── Reset ─────────────────────────────────────────────────
const resetScanner = () => {
    scanSuccess.value = false
    scanError.value = false
    errorMessage.value = ''
    participantData.value = null
    isProcessing.value = false
    if (isCameraActive.value) startScanning()
}

// ── Helpers ───────────────────────────────────────────────
const getCategoryDisplay = (p) => {
    if (!p) return '-'
    const parts = []
    if (p.division_name) parts.push(p.division_name)
    if (p.category_name) parts.push(p.category_name)
    return parts.join(' - ') || '-'
}

const formatTime = (date) =>
    new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(date)

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => startCamera())
onBeforeUnmount(() => stopCamera())
</script>

<style scoped>
.safe-area-top {
    padding-top: env(safe-area-inset-top);
}

/* Scanning beam animation */
.scan-beam {
    position: absolute;
    left: 22%;
    right: 22%;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, #f5c518cc, transparent);
    box-shadow: 0 0 12px 3px rgba(245, 197, 24, 0.5);
    animation: scan-beam 2s ease-in-out infinite;
    top: 22%;
}

.scan-beam.paused {
    animation-play-state: paused;
}

@keyframes scan-beam {
    0% {
        top: 22%;
        opacity: 0;
    }

    5% {
        opacity: 1;
    }

    50% {
        top: 75%;
    }

    95% {
        opacity: 1;
    }

    100% {
        top: 22%;
        opacity: 0;
    }
}

/* Corner brackets */
.abs-bracket {
    position: absolute;
    width: 28px;
    height: 28px;
    border-color: #f5c518;
    pointer-events: none;
}

/* Single bounce for success icon */
@keyframes bounce-once {
    0% {
        transform: scale(0.6);
        opacity: 0;
    }

    60% {
        transform: scale(1.1);
        opacity: 1;
    }

    80% {
        transform: scale(0.95);
    }

    100% {
        transform: scale(1);
    }
}

.animate-bounce-once {
    animation: bounce-once 0.5s ease-out forwards;
}
</style>
