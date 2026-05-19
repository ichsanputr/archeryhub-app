<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Enhanced Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>

      <!-- Decorative Background Elements -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Content -->
      <div class="relative p-6 sm:p-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex items-start gap-4">
            <!-- Icon Badge -->
            <div
              class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg shrink-0">
              <Icon icon="ph:qr-code-bold" class="text-white text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="flex-1">
              <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                QR Code Check-In
              </h1>
              <p class="text-slate-300 text-sm max-w-2xl font-medium">
                Scan participant QR codes or submit codes manually to check-in and re-register athletes instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left side: Camera feed -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
          <div class="w-full flex items-center justify-between mb-4 shrink-0">
            <h2 class="text-base font-black text-navy flex items-center gap-2">
              <Icon icon="ph:camera-bold" class="text-primary text-lg" />
              Camera Scanner
            </h2>

            <!-- Camera device selector -->
            <div v-if="videoDevices.length > 0" class="flex items-center gap-2">
              <label class="text-[11px] font-black text-gray-400 uppercase tracking-wider">Camera:</label>
              <select v-model="selectedDeviceId"
                class="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 font-bold text-navy focus:outline-none focus:border-primary"
                @change="restartCamera">
                <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
                  {{ device.label || `Camera ${videoDevices.indexOf(device) + 1}` }}
                </option>
              </select>
            </div>
          </div>

          <!-- Video box wrapper -->
          <div
            class="relative w-full aspect-[4/3] max-w-xl bg-gray-950 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center shadow-inner group">
            <video ref="videoElement" class="w-full h-full object-cover" autoplay playsinline></video>
            <canvas ref="canvasElement" class="hidden"></canvas>

            <!-- Scanning laser beam overlay -->
            <div v-if="isScanning && !scanResultStatus"
              class="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80"
              style="animation: scanLaser 2s linear infinite;"></div>

            <!-- Dashed focus guidelines -->
            <div v-if="isScanning && !scanResultStatus"
              class="absolute size-44 sm:size-60 border-2 border-dashed border-white/30 rounded-3xl flex items-center justify-center pointer-events-none">
              <div class="absolute inset-0 border-2 border-primary rounded-3xl animate-pulse opacity-70"></div>
            </div>

            <!-- Inactive overlay layout -->
            <div v-if="!isScanning"
              class="absolute inset-0 bg-navy/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
              <div class="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Icon icon="ph:camera-slash-bold" class="text-gray-400 text-3xl" />
              </div>
              <h3 class="text-white font-black text-sm mb-1">Camera Scanner is Offline</h3>
              <p class="text-slate-400 text-xs max-w-xs mb-6 font-medium leading-relaxed">
                Allow browser camera permissions to enable QR check-in capabilities.
              </p>
              <BaseButton variant="primary" class="font-black text-xs h-9 tracking-wider" @click="startScanning">
                <Icon icon="ph:play-bold" class="mr-1.5" /> Start Camera
              </BaseButton>
            </div>

            <!-- Active feedback status screens -->
            <Transition name="fade">
              <div v-if="scanResultStatus"
                class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md"
                :class="scanResultStatus === 'success' ? 'bg-green-950/95 text-green-100' : 'bg-red-950/95 text-red-100'">
                <div class="size-16 rounded-full flex items-center justify-center mb-4"
                  :class="scanResultStatus === 'success' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'">
                  <Icon :icon="scanResultStatus === 'success' ? 'ph:check-circle-bold' : 'ph:x-circle-bold'"
                    class="text-4xl" />
                </div>
                <h3 class="text-lg font-black tracking-tight mb-2">
                  {{ scanResultStatus === 'success' ? 'Check-In Successful' : 'Check-In Failed' }}
                </h3>
                <p class="text-xs font-semibold max-w-xs leading-relaxed mb-6">
                  {{ scanResultMessage }}
                </p>

                <!-- Detailed participant brief card -->
                <div v-if="scannedParticipant"
                  class="text-xs space-y-1.5 bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 w-full max-w-xs text-left shadow-lg">
                  <p class="truncate"><strong class="opacity-60">Athlete Name:</strong> {{ scannedParticipant.full_name }}</p>
                  <p class="truncate"><strong class="opacity-60">Category:</strong> {{ scannedParticipant.category_name }}</p>
                  <p class="truncate"><strong class="opacity-60">Club Name:</strong> {{ scannedParticipant.club_name || '-' }}</p>
                </div>

                <BaseButton variant="white" class="h-9 font-black text-xs px-6 shadow-md" @click="clearScanStatus">
                  Continue Scanning
                </BaseButton>
              </div>
            </Transition>
          </div>

          <!-- Action bar -->
          <div v-if="isScanning" class="w-full flex justify-center mt-4">
            <BaseButton variant="danger" class="font-black text-xs h-9 shadow-md shadow-red-100/50" @click="stopScanning">
              <Icon icon="ph:stop-bold" class="mr-1.5" /> Stop Scanner
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Right side: Manual & Log -->
      <div class="space-y-6">
        <!-- Manual input container -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
          <div class="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <h2 class="text-base font-bold text-navy mb-4 flex items-center gap-2">
            <Icon icon="ph:keyboard-bold" class="text-primary text-xl" />
            Manual Check-In
          </h2>
          <form @submit.prevent="submitManualCode" class="space-y-3">
            <p class="text-xs text-gray-500 font-semibold leading-relaxed">
              If the device camera is unavailable, type or paste the participant's QR code string here.
            </p>
            <div class="flex gap-2">
              <BaseInput v-model="manualCode" placeholder="Enter QR Raw string" class="flex-1" required />
              <BaseButton type="submit" variant="primary" class="font-black text-xs px-4" :loading="isSubmittingManual">
                Submit
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Session logs lists -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-[400px]">
          <h2 class="text-base font-bold text-navy mb-4 flex items-center justify-between shrink-0">
            <span class="flex items-center gap-2">
              <Icon icon="ph:list-bullets-bold" class="text-primary text-xl" />
              Check-In Log ({{ checkInLog.length }})
            </span>
            <button v-if="checkInLog.length > 0" class="text-xs text-red-500 font-black hover:underline"
              @click="clearLog">
              Clear Log
            </button>
          </h2>

          <div class="flex-1 overflow-y-auto space-y-3 no-scrollbar">
            <div v-if="checkInLog.length === 0"
              class="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <div class="size-12 rounded-xl bg-gray-50 flex items-center justify-center mb-2 text-gray-400">
                <Icon icon="ph:clipboard-bold" class="text-2xl" />
              </div>
              <p class="text-xs font-bold">No active check-ins during this session</p>
            </div>

            <!-- Single log entry card -->
            <div v-for="log in checkInLog" :key="log.uuid"
              class="p-3 bg-gray-50/50 border border-gray-100 rounded-xl flex gap-3 items-start hover:border-gray-200 transition-all">
              <div class="size-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                <Icon icon="ph:check-circle-bold" class="text-lg" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-black text-navy truncate leading-snug">{{ log.full_name }}</h4>
                <p class="text-[10px] text-gray-500 font-semibold truncate mt-0.5">{{ log.category_name }}</p>
                <p class="text-[9px] text-gray-400 font-bold mt-1">{{ log.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import jsQR from 'jsqr'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { definePageMeta, useHead } from '#imports'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'QR Check-In - Dashboard'
})

const { post } = useApi()
const toast = useToast()

// Refs for HTML Elements
const videoElement = ref(null)
const canvasElement = ref(null)

// Scanning configuration & status refs
const isScanning = ref(false)
const selectedDeviceId = ref('')
const videoDevices = ref([])
const manualCode = ref('')
const isSubmittingManual = ref(false)

// Scanned results indicators
const scanResultStatus = ref(null) // 'success' | 'error'
const scanResultMessage = ref('')
const scannedParticipant = ref(null)

// Check-in session records log
const checkInLog = ref([])

let stream = null
let animationFrameId = null

const requestCameraPermission = async () => {
  try {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    localStream.getTracks().forEach(track => track.stop()) // release immediately after permission grant

    const devices = await navigator.mediaDevices.enumerateDevices()
    videoDevices.value = devices.filter(d => d.kind === 'videoinput')
    if (videoDevices.value.length > 0) {
      selectedDeviceId.value = videoDevices.value[0].deviceId
    }
  } catch (error) {
    console.error('Camera initialization error:', error)
    toast.error('Camera permissions were denied or are unavailable')
  }
}

const startScanning = async () => {
  if (videoDevices.value.length === 0) {
    await requestCameraPermission()
  }

  if (videoDevices.value.length === 0) return

  clearScanStatus()
  isScanning.value = true

  try {
    const constraints = {
      video: selectedDeviceId.value
        ? { deviceId: { exact: selectedDeviceId.value } }
        : { facingMode: 'environment' }
    }

    stream = await navigator.mediaDevices.getUserMedia(constraints)
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      videoElement.value.setAttribute('playsinline', true) // essential for mobile devices
      videoElement.value.play()
    }

    // Begin scanning frame loops
    animationFrameId = requestAnimationFrame(scanFrame)
  } catch (err) {
    console.error('Failed to spin up camera feed:', err)
    toast.error('Failed to open camera hardware')
    isScanning.value = false
  }
}

const stopScanning = () => {
  isScanning.value = false
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }

  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
}

const restartCamera = async () => {
  stopScanning()
  await startScanning()
}

const scanFrame = () => {
  if (!isScanning.value) return

  const video = videoElement.value
  const canvas = canvasElement.value

  if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    })

    if (code && code.data) {
      handleCodeDetected(code.data)
      return
    }
  }

  animationFrameId = requestAnimationFrame(scanFrame)
}

const handleCodeDetected = async (codeString) => {
  // Prevent duplicate scanning requests while processing
  if (scanResultStatus.value) return

  // Play a simple browser scan beep if supported
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const osc = context.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, context.currentTime)
    osc.connect(context.destination)
    osc.start()
    osc.stop(context.currentTime + 0.1)
  } catch (e) {
    // browser audio policies might block this
  }

  try {
    const response = await post('/events/participants/reregister', { qr_raw: codeString })
    
    scanResultStatus.value = 'success'
    scanResultMessage.value = response.message || 'Check-in successful!'
    
    if (response.participant) {
      scannedParticipant.value = response.participant
      
      // Append to the list log
      const now = new Date()
      checkInLog.value.unshift({
        uuid: response.participant.uuid || Math.random().toString(),
        full_name: response.participant.full_name,
        category_name: response.participant.category_name,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      })
    }
  } catch (error) {
    console.error('QR re-registration scan error:', error)
    scanResultStatus.value = 'error'
    scanResultMessage.value = error?.data?.error || 'Participant registration not found or unpaid.'
    scannedParticipant.value = null
  }
}

const submitManualCode = async () => {
  if (!manualCode.value.trim()) return
  
  isSubmittingManual.value = true
  try {
    await handleCodeDetected(manualCode.value.trim())
    manualCode.value = ''
  } finally {
    isSubmittingManual.value = false
  }
}

const clearScanStatus = () => {
  scanResultStatus.value = null
  scanResultMessage.value = ''
  scannedParticipant.value = null
  
  // Resume video looping
  if (isScanning.value) {
    animationFrameId = requestAnimationFrame(scanFrame)
  }
}

const clearLog = () => {
  checkInLog.value = []
}

onMounted(() => {
  requestCameraPermission()
})

onBeforeUnmount(() => {
  stopScanning()
})
</script>

<style scoped>
@keyframes scanLaser {
  0% {
    top: 15%;
  }
  50% {
    top: 85%;
  }
  100% {
    top: 15%;
  }
}
</style>
