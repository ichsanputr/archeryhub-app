<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('settings.title')"
      :subtitle="t('settings.subtitle')"
      icon="ph:gear-six-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('settings.title') }
      ]"
    />

    <!-- Settings Nav Tabs -->
    <div class="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar shadow-xs">
      <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
        type="button"
        :class="activeTab === tab.value ? 'bg-white shadow-xs text-navy font-black' : 'text-slate-600 hover:text-navy hover:bg-white/50 font-bold'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[140px] px-5 py-3 rounded-xl text-sm whitespace-nowrap shrink-0 transition-all cursor-pointer">
        <Icon :icon="tab.icon" class="text-lg shrink-0" />
        <span class="whitespace-nowrap">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Keamanan Tab Content -->
    <div v-if="activeTab === 'security'"
      class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-8">

      <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
            <Icon icon="ph:shield-check-bold" class="text-xl" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
              {{ t('settings.security_title') }}
            </h3>
            <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
              {{ t('settings.security_subtitle') }}
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <!-- Email Change Section -->
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <div class="size-8 rounded-lg bg-primary/10 text-navy flex items-center justify-center shrink-0">
              <Icon icon="ph:envelope-simple-open-bold" class="text-base text-navy" />
            </div>
            <h4 class="text-sm font-black text-navy tracking-wide">
              {{ t('settings.change_email') }}
            </h4>
          </div>

          <div class="space-y-4 max-w-xl">
            <div>
              <label class="block text-xs font-bold text-navy tracking-wider mb-1.5">{{ t('settings.current_email') }}</label>
              <div
                class="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium text-xs font-mono">
                <Icon icon="ph:envelope-bold" class="text-slate-400" />
                {{ userData?.email }}
              </div>
            </div>

            <div v-if="!otpSent">
              <label class="block text-xs font-bold text-navy tracking-wider mb-1.5">{{ t('settings.new_email') }}</label>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <Icon icon="ph:at-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="emailForm.new_email" type="email" :placeholder="t('settings.new_email_placeholder')"
                    class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                </div>
                <BaseButton variant="primary" size="md" @click="requestOTP" :loading="isRequestingOTP"
                  :disabled="!emailForm.new_email">
                  {{ t('settings.send_otp') }}
                </BaseButton>
              </div>
              <div class="text-[10px] text-slate-400 mt-2">
                {{ t('settings.email_hint') }}
              </div>
            </div>

            <div v-else class="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
              <div class="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                <Icon icon="ph:info-bold" class="text-navy shrink-0" />
                <div class="text-xs text-navy font-medium">
                  {{ t('settings.otp_sent_to', { email: emailForm.new_email }) }}
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-navy tracking-wider mb-1.5">{{ t('settings.verification_code') }}</label>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <Icon icon="ph:key-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input v-model="emailForm.otp" type="text" maxlength="6" placeholder="000000"
                      class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black tracking-[0.5em] focus:outline-none focus:border-primary transition-all text-navy" />
                  </div>
                  <BaseButton variant="gold" size="md" @click="verifyEmailChange" :loading="isVerifyingOTP"
                    :disabled="emailForm.otp.length < 6">
                    {{ t('settings.verify_change') }}
                  </BaseButton>
                </div>
              </div>

              <button @click="otpSent = false"
                class="text-xs font-bold text-slate-400 hover:text-navy transition-colors cursor-pointer">
                {{ t('settings.use_different_email') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Change Password Form -->
        <div class="pt-8 border-t border-slate-100">
          <div class="flex items-center gap-2.5 mb-6">
            <div class="size-8 rounded-lg bg-primary/10 text-navy flex items-center justify-center shrink-0">
              <Icon icon="ph:lock-key-bold" class="text-base text-navy" />
            </div>
            <h4 class="text-sm font-black text-navy tracking-wide">
              {{ hasPassword ? t('settings.change_password') : t('settings.set_password') }}
            </h4>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <BaseInput v-model="securityForm.new_password" :label="t('settings.new_password')" type="password"
                placeholder="••••••••" required />
              <BaseInput v-model="securityForm.confirm_password" :label="t('settings.confirm_password')" type="password"
                placeholder="••••••••" required />
            </div>

            <div class="pt-4 border-t border-slate-100">
              <BaseButton variant="primary" size="md" icon="ph:lock-key-bold" @click="changePassword"
                :loading="isChangingPassword" :disabled="!securityForm.new_password">
                {{ hasPassword ? t('settings.change_password') : t('settings.set_password') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: Tema -->
    <div v-show="activeTab === 'theme'" class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
            <Icon icon="ph:palette-bold" class="text-xl" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-navy leading-snug flex items-center gap-2">
              {{ t('settings.theme_title') }}
              <Icon v-if="isSyncing" icon="ph:circle-notch" class="animate-spin text-navy text-sm" />
            </h3>
            <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
              {{ t('settings.theme_subtitle') }}
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        <div v-for="(theme, key) in themes" :key="key" role="button"
          class="relative overflow-hidden rounded-2xl border-2 transition-all group cursor-pointer" :class="currentTheme === key
            ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-md'
            : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'" @click="currentTheme = key">
          <!-- Theme Preview Header -->
          <div class="h-28 w-full flex relative overflow-hidden" :style="{ backgroundColor: theme.sidebarBg }">
            <!-- Simulated Motif Pattern -->
            <div class="absolute inset-0 pointer-events-none"
              :style="{ backgroundImage: theme.motif, opacity: theme.motifOpacity || '0.2' }"></div>

            <div class="w-1/4 h-full border-r border-white/10 flex flex-col gap-2 p-3 relative z-10 bg-black/10">
              <div class="w-full h-2 rounded bg-white/30"></div>
              <div class="w-2/3 h-1.5 rounded bg-white/15"></div>
              <div class="w-4/5 h-1.5 rounded bg-white/15"></div>
              <div class="w-1/2 h-1.5 rounded bg-white/15"></div>
            </div>
            <div class="w-3/4 h-full flex flex-col relative z-10">
              <div class="h-7 w-full bg-white/95 backdrop-blur-xs flex items-center justify-between px-3 border-b border-gray-100">
                <div class="w-12 h-1.5 rounded bg-gray-200"></div>
                <div class="size-2.5 rounded-full" :style="{ backgroundColor: theme.primary }"></div>
              </div>
              <div class="flex-1 p-3 flex items-center justify-center">
                <div
                  class="h-full w-full rounded-xl border-2 border-dashed flex items-center justify-center transition-transform group-hover:scale-105"
                  :class="currentTheme === key ? 'border-primary bg-white/90 shadow-xs' : 'border-white/20 bg-white/40'"
                  :style="{ color: theme.primary }">
                  <Icon icon="ph:check-circle-fill" v-if="currentTheme === key" class="text-2xl" />
                  <Icon icon="ph:palette-bold" v-else class="text-xl text-white/60" />
                </div>
              </div>
            </div>
          </div>

          <!-- Theme Info -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-bold text-navy capitalize">{{ key }}</h4>
              <div class="flex gap-1">
                <div class="size-3 rounded-full" :style="{ backgroundColor: theme.primary }"></div>
                <div class="size-3 rounded-full" :style="{ backgroundColor: theme.sidebarBg }"></div>
              </div>
            </div>
            <div class="text-xs text-slate-400 capitalize">
              {{ t('settings.theme_desc') }}
            </div>
          </div>

          <!-- Selection Indicator -->
          <div v-if="currentTheme === key"
            class="absolute top-2.5 right-2.5 flex items-center justify-center bg-white rounded-full p-1 shadow-md z-20">
            <Icon icon="ph:check-circle-fill" class="text-primary text-lg" />
          </div>
        </div>
      </div>

      <!-- Save Button (Optional depending on tab) -->
      <div v-if="activeTab === 'theme'" class="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
        <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveSettings" :loading="isSavingGeneral">
          {{ t('settings.save_changes') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useTheme } from '~/composables/useTheme'
import { useI18n } from 'vue-i18n'
import BaseSelect from '~/components/common/BaseSelect.vue'

const { t } = useI18n()

definePageMeta({
  title: 'Pengaturan',
  layout: 'dashboard'
})

useHead({
  title: computed(() => `${t('settings.title')} - Archeris Dashboard`)
})
const { login, user, organizerProfile } = useAuth()
const { get, put } = useApi()
const toast = useToast()
const { currentTheme, themes, isSyncing } = useTheme()
const route = useRoute()

const tabs = computed(() => [
  { label: t('settings.security_tab'), value: 'security', icon: 'ph:shield-check' },
  { label: t('settings.theme_tab'), value: 'theme', icon: 'ph:palette' },
])



const activeTab = ref('security')
const isRequestingOTP = ref(false)
const isVerifyingOTP = ref(false)
const otpSent = ref(false)
const emailForm = ref({
  new_email: '',
  otp: ''
})
const isSavingAccount = ref(false)
const isSavingGeneral = ref(false)
const isChangingPassword = ref(false)
const isResetting = ref(false)
const userData = ref(null)

const securityForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const hasPassword = computed(() => !!userData.value?.has_password)



// Determine user type
const userType = computed(() => userData.value?.user_type || user.value?.role || user.value?.type || 'archer')
const userTypeLabel = computed(() => {
  const labels = { archer: 'Pemanah', organizer: 'Penyelenggara', club: 'Klub', admin: 'Admin' }
  return labels[userType.value] || 'Pengguna'
})
const userTypeIcon = computed(() => {
  const icons = { archer: 'ph:user', organizer: 'ph:buildings', club: 'ph:users-three', admin: 'ph:shield-star' }
  return icons[userType.value] || 'ph:user'
})

const accountForm = ref({
  email: '',
  username: '',
  full_name: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  city: '',
  address: '',
  school: '',
  bow_type: ''
})

const initialAccountForm = ref(null)

const linkGoogle = () => {
  login(user.value?.role || 'archer', { is_linking: 'true' })
}

onMounted(async () => {
  // Check for error in query params (e.g. from Google linking)
  if (route.query.error === 'email_mismatch') {
    toast.error(t('organization_settings_page.google_mismatch_error'))
  }

  try {
    const response = await get('/user/profile')
    userData.value = response
    accountForm.value.email = response.email || ''
    accountForm.value.username = response.username || ''
    accountForm.value.full_name = response.full_name || ''
    accountForm.value.phone = response.phone || ''
    accountForm.value.date_of_birth = response.date_of_birth ? new Date(response.date_of_birth).toISOString().split('T')[0] : ''
    accountForm.value.gender = response.gender || ''
    accountForm.value.city = response.city || ''
    accountForm.value.address = response.address || ''
    accountForm.value.school = response.school || ''
    accountForm.value.bow_type = response.bow_type || ''

    // Store for reset
    initialAccountForm.value = JSON.parse(JSON.stringify(accountForm.value))
  } catch (error) {
    console.error('Failed to load user data:', error)
    toast.error(t('organization_settings_page.load_user_error'))
  }
})

const saveAccountInfo = async () => {
  isSavingAccount.value = true
  try {
    await put('/user/profile', {
      username: accountForm.value.username,
      full_name: accountForm.value.full_name,
      phone: accountForm.value.phone,
      date_of_birth: accountForm.value.date_of_birth,
      gender: accountForm.value.gender,
      city: accountForm.value.city,
      address: accountForm.value.address,
      school: accountForm.value.school,
      bow_type: accountForm.value.bow_type
    })
    toast.success(t('organization_settings_page.save_success'))

    // Update reset checkpoint
    initialAccountForm.value = JSON.parse(JSON.stringify(accountForm.value))

    // Update local user data if needed
    if (userData.value) {
      userData.value.username = accountForm.value.username
      userData.value.full_name = accountForm.value.full_name
    }
  } catch (error) {
    console.error('Failed to save account info:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || t('organization_settings_page.general_save_error')
    toast.error(errorMessage)
  } finally {
    isSavingAccount.value = false
  }
}

const resetForm = async () => {
  if (!initialAccountForm.value) return

  isResetting.value = true
  try {
    // Simulate minor delay for UX
    await new Promise(resolve => setTimeout(resolve, 600))
    accountForm.value = JSON.parse(JSON.stringify(initialAccountForm.value))
    toast.info(t('organization_settings_page.reset_info'))
  } finally {
    isResetting.value = false
  }
}

const saveSettings = async () => {
  isSavingGeneral.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success(t('organization_settings_page.general_save_success'))
  } catch (error) {
    toast.error(t('organization_settings_page.general_save_error'))
  } finally {
    isSavingGeneral.value = false
  }
}

const changePassword = async () => {
  if (securityForm.value.new_password !== securityForm.value.confirm_password) {
    toast.error(t('organization_settings_page.password_mismatch'))
    return
  }

  if (securityForm.value.new_password.length < 6) {
    toast.error(t('organization_settings_page.password_length_error'))
    return
  }

  isChangingPassword.value = true
  try {
    await put('/user/password', {
      new_password: securityForm.value.new_password
    })

    toast.success(t('organization_settings_page.password_success'))

    // Reset form
    securityForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }

    // Update has_password status locally
    if (userData.value) {
      userData.value.has_password = true
    }
  } catch (error) {
    console.error('Failed to change password:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || t('organization_settings_page.password_error')
    toast.error(errorMessage)
  } finally {
    isChangingPassword.value = false
  }
}

const requestOTP = async () => {
  if (!emailForm.value.new_email) return
  isRequestingOTP.value = true
  try {
    const { post } = useApi()
    await post('/user/request-email-change', {
      new_email: emailForm.value.new_email
    })
    otpSent.value = true
    toast.success(t('organization_settings_page.otp_send_success'))
  } catch (error) {
    const errorMsg = error?.data?.error || t('organization_settings_page.otp_send_error')
    toast.error(errorMsg)
  } finally {
    isRequestingOTP.value = false
  }
}

const verifyEmailChange = async () => {
  if (!emailForm.value.otp) return
  isVerifyingOTP.value = true
  try {
    const { post } = useApi()
    const response = await post('/user/verify-email-change', {
      new_email: emailForm.value.new_email,
      otp: emailForm.value.otp
    })

    toast.success(response.message)

    // Refresh user data to show new email
    if (userData.value) userData.value.email = emailForm.value.new_email

    // Reset form
    otpSent.value = false
    emailForm.value = { new_email: '', otp: '' }
  } catch (error) {
    const errorMsg = error?.data?.error || t('organization_settings_page.otp_verify_error')
    toast.error(errorMsg)
  } finally {
    isVerifyingOTP.value = false
  }
}

</script>
