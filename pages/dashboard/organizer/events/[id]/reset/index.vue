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
              class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon icon="ph:arrow-counter-clockwise-bold" class="text-white text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="flex-1">
              <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                Reset Event Data
              </h1>
              <div class="text-slate-300 text-sm max-w-2xl font-medium">
                Reset and purge qualification, elimination, or participant registration data for event {{ eventName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-48"></div>
        <div class="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-96"></div>
      </div>
    </div>

    <!-- Main Workspace -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Info Panel -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
          <div class="absolute top-0 left-0 w-full h-1 bg-primary"></div>

          <h2 class="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Icon icon="ph:shield-warning-bold" class="text-primary text-xl" />
            Important Information
          </h2>

          <div class="space-y-4">
            <div class="p-4 bg-navy/5 rounded-xl border border-navy/10 flex gap-3">
              <Icon icon="ph:info-bold" class="text-primary text-lg shrink-0 mt-0.5" />
              <div class="text-xs text-navy leading-relaxed font-semibold">
                Reset actions are permanent. Once deleted, data cannot be recovered from the database server.
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <h3 class="text-xs font-black text-navy tracking-wider">Safety Guidelines</h3>
              <ul class=" text-xs text-gray-500 space-y-2.5 font-bold">
                <li class="flex items-start gap-2">
                  <Icon icon="ph:check-circle-bold" class="text-green-500 shrink-0 mt-0.5 text-sm" />
                  Ensure no archers are currently submitting qualification or match scores.
                </li>
                <li class="flex items-start gap-2">
                  <Icon icon="ph:check-circle-bold" class="text-green-500 shrink-0 mt-0.5 text-sm" />
                  Export participant data to CSV beforehand if you require a local backup copy.
                </li>
                <li class="flex items-start gap-2">
                  <Icon icon="ph:check-circle-bold" class="text-green-500 shrink-0 mt-0.5 text-sm" />
                  A verification OTP code sent to your registered email is required before initiating any reset.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Options Panel -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
            <Icon icon="ph:gear-six-bold" class="text-primary text-xl" />
            Available Reset Options
          </h2>

          <!-- Reset Options Cards list -->
          <div class="space-y-4">
            <!-- Option 1: Qualification -->
            <div
              class="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div class="flex items-start gap-4">
                <div
                  class="size-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <Icon icon="ph:target-bold" class="text-gray-600 text-2xl" />
                </div>
                <div>
                  <h3 class="text-sm font-black text-navy leading-snug">Reset Qualification</h3>
                  <div class=" text-xs text-gray-500 font-semibold leading-relaxed mt-1">
                    Deletes all qualification scores (arrow scores, end scores), log scores, target assignments, and resets participant target allocations.
                  </div>
                </div>
              </div>
              <BaseButton variant="danger" class="shrink-0 h-9 font-bold text-xs shadow-md shadow-red-100/50"
                :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                @click="isSubscriptionActive ? openConfirmDialog('qualification', 'Reset Qualification') : (showPremiumModal = true)">
                <Icon icon="ph:arrow-counter-clockwise-bold" class="mr-1.5 text-sm" />
                Reset Qualification
              </BaseButton>
            </div>

            <!-- Option 2: Elimination -->
            <div
              class="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div class="flex items-start gap-4">
                <div
                  class="size-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <Icon icon="mdi:bracket" class="text-gray-600 text-2xl" />
                </div>
                <div>
                  <h3 class="text-sm font-black text-navy leading-snug">Reset Elimination & Brackets</h3>
                  <div class=" text-xs text-gray-500 font-semibold leading-relaxed mt-1">
                    Deletes elimination matches, bracket structures, and match scores. Useful for re-configuring elimination structures.
                  </div>
                </div>
              </div>
              <BaseButton variant="danger" class="shrink-0 h-9 font-bold text-xs shadow-md shadow-red-100/50"
                :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                @click="isSubscriptionActive ? openConfirmDialog('elimination', 'Reset Elimination & Brackets') : (showPremiumModal = true)">
                <Icon icon="ph:arrow-counter-clockwise-bold" class="mr-1.5 text-sm" />
                Reset Bracket
              </BaseButton>
            </div>

            <!-- Option 3: Participants -->
            <div
              class="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div class="flex items-start gap-4">
                <div
                  class="size-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <Icon icon="ph:users-three-bold" class="text-gray-600 text-2xl" />
                </div>
                <div>
                  <h3 class="text-sm font-black text-navy leading-snug">Delete All Participants</h3>
                  <div class=" text-xs text-gray-500 font-semibold leading-relaxed mt-1">
                    Unregisters and deletes all participants from this event. This automatically cleans up dependent qualification and elimination data.
                  </div>
                </div>
              </div>
              <BaseButton variant="danger" class="shrink-0 h-9 font-bold text-xs shadow-md shadow-red-100/50"
                :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                @click="isSubscriptionActive ? openConfirmDialog('participants', 'Delete All Participants') : (showPremiumModal = true)">
                <Icon icon="ph:user-minus-bold" class="mr-1.5 text-sm" />
                Delete Participants
              </BaseButton>
            </div>

            <!-- Option 4: Factory Reset -->
            <div
              class="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div class="flex items-start gap-4">
                <div
                  class="size-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <Icon icon="ph:trash-bold" class="text-gray-600 text-2xl" />
                </div>
                <div>
                  <h3 class="text-sm font-black text-navy leading-snug">Factory Reset (Full Reset)</h3>
                  <div class=" text-xs text-gray-500 font-semibold leading-relaxed mt-1">
                    Cleans all event data back to its original state. Removes participants, targets, qualification, elimination, and all scoring data completely.
                  </div>
                </div>
              </div>
              <BaseButton variant="danger" class="shrink-0 h-9 font-bold text-xs shadow-md shadow-red-100/50"
                :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                @click="isSubscriptionActive ? openConfirmDialog('all', 'Factory Reset (Full Reset)') : (showPremiumModal = true)">
                <Icon icon="ph:trash-bold" class="mr-1.5 text-sm" />
                Factory Reset
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Double Confirmation Dialog -->
    <BaseDialogForm v-model="showConfirmDialog" @close="closeConfirmDialog">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
            <Icon icon="ph:warning-octagon-bold" class="text-xl text-red-600" />
          </div>
          <h2 class="text-xl font-black text-navy">Confirm Data Reset</h2>
        </div>
      </template>

      <div class="space-y-5">
        <!-- Verification OTP Segment -->
        <div v-if="!otpSent" class="space-y-3 text-center py-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
          <Icon icon="ph:envelope-open-bold" class="text-4xl text-primary mx-auto animate-bounce" />
          <div class="space-y-1">
            <h3 class="text-xs font-black text-navy">Request Verification Code</h3>
            <div class="text-[10px] text-gray-500 max-w-xs mx-auto font-medium">
              A 6-digit OTP verification code will be sent to your email to authorize this action.
            </div>
          </div>
          <BaseButton variant="primary" class="font-black text-xs h-9 tracking-wider shadow-md" :loading="sendingOtp" @click="requestVerificationCode">
            Send Code to Email
          </BaseButton>
        </div>

        <!-- Verification Input fields -->
        <div v-else class="space-y-4">
          <!-- Already Verified Banner -->
          <div v-if="isOtpVerified" class="p-4 bg-green-50 border border-green-200 rounded-2xl flex flex-col gap-2 items-center text-center">
            <div class="size-10 bg-green-100 rounded-full flex items-center justify-center">
              <Icon icon="ph:shield-check-fill" class="text-2xl text-green-600" />
            </div>
            <div>
              <h4 class="text-xs font-black text-green-900">Email Verified</h4>
              <div class="text-[10px] text-green-700 mt-0.5 font-medium font-sans">
                You can perform additional resets without requesting another OTP for the next <span class="font-black font-mono text-green-800">{{ formattedRemainingTime }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="p-3 bg-green-50 border border-green-100 rounded-xl flex gap-2.5 items-start">
            <Icon icon="ph:check-circle-bold" class="text-green-600 text-lg shrink-0 mt-0.5" />
            <div class=" text-xs text-green-800 font-semibold leading-relaxed">
              Verification code has been sent to your registered email. It is valid for 15 minutes.
            </div>
          </div>

          <!-- OTP Input -->
          <div v-if="!isOtpVerified" class="space-y-2">
            <label class="block text-xs font-bold text-navy">
              Enter 6-Digit OTP Code *
            </label>
            <BaseInput v-model="otpCode" placeholder="Enter the 6-digit OTP code" type="text" maxlength="6" class="font-mono text-center tracking-widest text-lg font-black" required />
          </div>

          <!-- Text Confirmation -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-navy">
              Type the word <span class="text-red-600 font-black">RESET</span> to continue *
            </label>
            <BaseInput v-model="confirmText" placeholder="Type RESET" required />
          </div>
        </div>
      </div>

      <template #action>
        <BaseButton variant="white" @click="closeConfirmDialog" :disabled="isSubmitting">
          Cancel
        </BaseButton>
        <BaseButton v-if="otpSent" variant="danger" @click="handleReset" :loading="isSubmitting" :disabled="confirmText !== 'RESET' || otpCode.trim().length !== 6">
          <Icon icon="ph:arrow-counter-clockwise-bold" class="mr-1.5" />
          Yes, Reset Now
        </BaseButton>
      </template>
    </BaseDialogForm>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { definePageMeta, useHead } from '#imports'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('reset_event.title', 'Reset Event Data') + ' - ArcheryHub Dashboard')
})

const route = useRoute()
const { get, post } = useApi()
const toast = useToast()
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

const eventId = route.params.id
const eventName = ref('Loading...')
const event = ref(null)
const isLoading = ref(true)

// Verification states
const showConfirmDialog = ref(false)
const confirmText = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const sendingOtp = ref(false)
const isSubmitting = ref(false)
const currentActionTarget = ref('')
const currentActionTitle = ref('')

// 5 Minutes Active Verification Session States
const verifiedOtp = ref('')
const verifiedTime = ref(null)
const remainingTime = ref(0)
let timerId = null

const isOtpVerified = computed(() => {
  return !!(verifiedOtp.value && verifiedTime.value && (Date.now() - verifiedTime.value < 5 * 60 * 1000))
})

const formattedRemainingTime = computed(() => {
  const m = Math.floor(remainingTime.value / 60)
  const s = remainingTime.value % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
})

const startCountdown = () => {
  if (timerId) clearInterval(timerId)
  const update = () => {
    if (!verifiedTime.value) {
      remainingTime.value = 0
      return
    }
    const diff = Math.max(0, 5 * 60 * 1000 - (Date.now() - verifiedTime.value))
    remainingTime.value = Math.ceil(diff / 1000)
    if (remainingTime.value <= 0) {
      verifiedOtp.value = ''
      verifiedTime.value = null
      otpCode.value = ''
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }
    }
  }
  update()
  timerId = setInterval(update, 1000)
}

const fetchEventDetails = async () => {
  isLoading.value = true
  try {
    const response = await get(`/events/${eventId}`)
    event.value = response
    eventName.value = response?.name || 'Event'
  } catch (error) {
    console.error('Failed to load event:', error)
    toast.error('Failed to load event details')
  } finally {
    isLoading.value = false
  }
}

const openConfirmDialog = (target, title) => {
  currentActionTarget.value = target
  currentActionTitle.value = title
  confirmText.value = ''
  
  if (isOtpVerified.value) {
    otpCode.value = verifiedOtp.value
    otpSent.value = true
  } else {
    otpCode.value = ''
    otpSent.value = false
  }
  showConfirmDialog.value = true
}

const closeConfirmDialog = () => {
  showConfirmDialog.value = false
  confirmText.value = ''
  if (!isOtpVerified.value) {
    otpCode.value = ''
    otpSent.value = false
  }
}

const requestVerificationCode = async () => {
  sendingOtp.value = true
  try {
    await post(`/events/${eventId}/reset/request-code`)
    otpSent.value = true
    toast.success('Verification code sent to your email')
  } catch (error) {
    console.error('Failed to request reset OTP code:', error)
    toast.error(error?.data?.error || 'Failed to send verification code')
  } finally {
    sendingOtp.value = false
  }
}

const handleReset = async () => {
  if (confirmText.value !== 'RESET') {
    toast.error('Confirmation text must be "RESET"')
    return
  }

  if (otpCode.value.trim().length !== 6) {
    toast.error('OTP code must be 6 digits')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      target: currentActionTarget.value,
      confirm_text: confirmText.value,
      code: otpCode.value.trim()
    }

    await post(`/events/${eventId}/reset`, payload)
    toast.success(`Successfully completed: ${currentActionTitle.value}`)
    
    // Save verified OTP and time for 5 minutes window
    verifiedOtp.value = otpCode.value.trim()
    verifiedTime.value = Date.now()
    startCountdown()
    
    closeConfirmDialog()
  } catch (error) {
    console.error('Failed to reset event data:', error)
    toast.error(error?.data?.error || 'Failed to reset event data')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchEventDetails()
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId)
  }
})
</script>
