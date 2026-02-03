<template>
    <div class="min-h-screen bg-gradient-to-br from-navy via-navy to-navy/90 flex flex-col">
        <!-- Header -->
        <div class="safe-area-top bg-navy/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
            <div class="px-4 py-4 flex items-center justify-between">
                <button @click="goBack" 
                    class="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Icon icon="ph:arrow-left" class="text-white text-xl" />
                </button>
                <h1 class="text-white font-black text-lg tracking-tight">Scan QR Code</h1>
                <div class="w-10"></div>
            </div>
        </div>

        <!-- Scanner Area -->
        <div class="flex-1 flex flex-col items-center justify-center p-4 relative">
            <!-- Success State -->
            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="scanSuccess" 
                    class="absolute inset-0 bg-green-600/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-50">
                    <div class="bg-white rounded-full p-8 mb-6 animate-bounce">
                        <Icon icon="ph:check-circle-fill" class="text-6xl text-green-600" />
                    </div>
                    <h2 class="text-3xl font-black text-white mb-3 text-center">Registrasi Berhasil!</h2>
                    <p class="text-green-100 text-center text-lg font-medium mb-2">{{ participantData?.full_name }}</p>
                    <p class="text-green-200 text-center text-sm mb-8">{{ participantData?.club_name || 'Individu' }}</p>
                    
                    <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 w-full max-w-sm">
                        <div class="flex items-center justify-between text-white mb-3">
                            <span class="text-sm font-medium opacity-80">Kategori</span>
                            <span class="text-sm font-bold">{{ getCategoryDisplay(participantData) }}</span>
                        </div>
                        <div class="flex items-center justify-between text-white">
                            <span class="text-sm font-medium opacity-80">Waktu Registrasi</span>
                            <span class="text-sm font-bold">{{ formatTime(new Date()) }}</span>
                        </div>
                    </div>

                    <BaseButton variant="white" size="lg" @click="resetScanner" 
                        class="min-w-[200px] font-black shadow-xl">
                        Scan Berikutnya
                    </BaseButton>
                </div>
            </Transition>

            <!-- Error State -->
            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="scanError" 
                    class="absolute inset-0 bg-red-600/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-50">
                    <div class="bg-white rounded-full p-8 mb-6">
                        <Icon icon="ph:x-circle-fill" class="text-6xl text-red-600" />
                    </div>
                    <h2 class="text-3xl font-black text-white mb-3 text-center">Registrasi Gagal</h2>
                    <p class="text-red-100 text-center mb-8 max-w-sm">{{ errorMessage }}</p>
                    
                    <BaseButton variant="white" size="lg" @click="resetScanner" 
                        class="min-w-[200px] font-black shadow-xl">
                        Coba Lagi
                    </BaseButton>
                </div>
            </Transition>

            <!-- Camera View -->
            <div v-if="!scanSuccess && !scanError" class="w-full max-w-md mx-auto">
                <!-- Scanner Frame -->
                <div class="relative bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <!-- Video Element -->
                    <video ref="videoElement" 
                        class="w-full aspect-square object-cover"
                        autoplay 
                        playsinline 
                        muted>
                    </video>
                    
                    <!-- Scanning Overlay -->
                    <div class="absolute inset-0 pointer-events-none">
                        <!-- Corner Borders -->
                        <div class="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-2xl"></div>
                        <div class="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-2xl"></div>
                        <div class="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-2xl"></div>
                        <div class="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-2xl"></div>
                        
                        <!-- Scanning Line -->
                        <div class="absolute inset-x-8 top-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                    </div>

                    <!-- Processing Indicator -->
                    <div v-if="isProcessing" 
                        class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div class="text-center">
                            <div class="inline-block h-12 w-12 border-4 border-primary border-t-transparent animate-spin rounded-full mb-3"></div>
                            <p class="text-white font-bold text-sm">Memproses...</p>
                        </div>
                    </div>
                </div>

                <!-- Instructions -->
                <div class="mt-8 text-center px-4">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                        <Icon icon="ph:qr-code" class="text-primary text-xl" />
                        <span class="text-white text-sm font-bold">Arahkan kamera ke QR Code</span>
                    </div>
                    <p class="text-white/70 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                        Pastikan QR Code terlihat jelas dalam frame untuk proses registrasi ulang
                    </p>
                </div>
            </div>
        </div>

        <!-- Canvas for QR Detection (Hidden) -->
        <canvas ref="canvasElement" class="hidden"></canvas>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import jsQR from 'jsqr'
import { definePageMeta, useHead } from '#imports'

definePageMeta({
    layout: false
})

useHead({
    title: 'Scan QR Code - ArcheryHub'
})

const router = useRouter()
const { post } = useApi()

const videoElement = ref(null)
const canvasElement = ref(null)
const stream = ref(null)
const scanningInterval = ref(null)

const isProcessing = ref(false)
const scanSuccess = ref(false)
const scanError = ref(false)
const errorMessage = ref('')
const participantData = ref(null)

const goBack = () => {
    router.back()
}

const startCamera = async () => {
    try {
        const constraints = {
            video: {
                facingMode: 'environment', // Use back camera
                width: { ideal: 1280 },
                height: { ideal: 1280 }
            }
        }
        
        stream.value = await navigator.mediaDevices.getUserMedia(constraints)
        videoElement.value.srcObject = stream.value
        
        // Start scanning after video is ready
        videoElement.value.addEventListener('loadedmetadata', () => {
            startScanning()
        })
    } catch (error) {
        console.error('Camera error:', error)
        errorMessage.value = 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.'
        scanError.value = true
    }
}

const startScanning = () => {
    scanningInterval.value = setInterval(() => {
        if (isProcessing.value || scanSuccess.value || scanError.value) return
        
        const video = videoElement.value
        const canvas = canvasElement.value
        
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return
        
        const ctx = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
        })
        
        if (code) {
            handleQRDetected(code.data)
        }
    }, 300) // Scan every 300ms
}

const handleQRDetected = async (qrData) => {
    if (isProcessing.value) return
    
    isProcessing.value = true
    
    try {
        // Call API to register participant
        const response = await post('/events/participants/reregister', {
            qr_raw: qrData
        })
        
        if (response && response.success) {
            participantData.value = response.participant
            scanSuccess.value = true
            stopScanning()
            
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100])
            }
        } else {
            throw new Error(response?.message || 'Registrasi gagal')
        }
    } catch (error) {
        console.error('Registration error:', error)
        errorMessage.value = error.response?.data?.error || error.message || 'QR Code tidak valid atau peserta tidak ditemukan'
        scanError.value = true
        stopScanning()
        
        // Error vibration
        if (navigator.vibrate) {
            navigator.vibrate(200)
        }
    } finally {
        isProcessing.value = false
    }
}

const resetScanner = () => {
    scanSuccess.value = false
    scanError.value = false
    errorMessage.value = ''
    participantData.value = null
    isProcessing.value = false
    startScanning()
}

const stopScanning = () => {
    if (scanningInterval.value) {
        clearInterval(scanningInterval.value)
        scanningInterval.value = null
    }
}

const stopCamera = () => {
    stopScanning()
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
        stream.value = null
    }
}

const getCategoryDisplay = (participant) => {
    if (!participant) return '-'
    const parts = []
    if (participant.division_name) parts.push(participant.division_name)
    if (participant.category_name) parts.push(participant.category_name)
    return parts.join(' - ') || '-'
}

const formatTime = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date)
}

onMounted(() => {
    startCamera()
})

onBeforeUnmount(() => {
    stopCamera()
})
</script>

<style scoped>
.safe-area-top {
    padding-top: env(safe-area-inset-top);
}

@keyframes scan-line {
    0%, 100% {
        transform: translateY(-100%);
    }
    50% {
        transform: translateY(100%);
    }
}
</style>
