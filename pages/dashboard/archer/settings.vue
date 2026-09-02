<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('settings.title', 'Pengaturan')"
      :subtitle="t('settings.subtitle', 'Kelola keamanan akun dan preferensi tema tampilan dashboard Anda.')"
      icon="ph:gear-six-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: t('settings.title', 'Pengaturan') }
      ]"
    />

    <!-- Settings Nav Tabs -->
    <div class="flex gap-1 bg-slate-100 rounded-2xl p-1.5 overflow-x-auto no-scrollbar shadow-sm">
      <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
        :class="activeTab === tab.value ? 'bg-white shadow-sm text-navy font-black' : 'text-slate-500 hover:text-navy hover:bg-white/50 font-bold'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[120px] sm:min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all">
        <Icon :icon="tab.icon" class="text-base shrink-0" />
        <span class="whitespace-nowrap">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Keamanan Tab Content -->
    <div v-if="activeTab === 'security'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">

      <div>
        <h3 class="text-xl font-bold text-navy mb-2">{{ t('settings.security_title', 'Keamanan Akun') }}</h3>
        <div class="text-gray-500 text-sm mb-6">{{ t('settings.security_subtitle', 'Kelola alamat email dan kata sandi untuk melindungi akses akun Anda.') }}</div>

        <!-- Email Change Section -->
        <div class="mb-8">
          <h4 class="text-sm font-black text-navy tracking-widest mb-4 flex items-center gap-2">
            <Icon icon="ph:envelope-simple-open-bold" class="text-primary" />
            {{ t('settings.change_email', 'Ubah Alamat Email') }}
          </h4>

          <div class="space-y-4 max-w-xl">
            <div>
              <label class="block text-xs font-bold text-navy tracking-wider mb-1.5">{{ t('settings.current_email', 'Email Saat Ini') }}</label>
              <div
                class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 font-medium text-xs font-mono">
                <Icon icon="ph:envelope-bold" />
                {{ userData?.email || 'Memuat...' }}
              </div>
            </div>

            <div v-if="!otpSent">
              <label class="block text-xs font-bold text-navy tracking-wider mb-1.5">{{ t('settings.new_email', 'Email Baru') }}</label>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <Icon icon="ph:at-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input v-model="emailForm.new_email" type="email" :placeholder="t('settings.new_email_placeholder', 'nama@email.com')"
                    class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                </div>
                <BaseButton variant="primary" size="md" @click="requestOTP" :loading="isRequestingOTP"
                  :disabled="!emailForm.new_email">
                  {{ t('settings.send_otp', 'Kirim OTP') }}
                </BaseButton>
              </div>
              <div class="text-[10px] text-gray-400 mt-2">
                {{ t('settings.email_hint', 'Kami akan mengirimkan 6 digit kode verifikasi ke alamat email baru.') }}
              </div>
            </div>

            <div v-else class="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
              <div class="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                <Icon icon="ph:info-bold" class="text-primary" />
                <div class="text-xs text-primary-dark font-medium" v-html="t('settings.otp_sent_to', { email: `<strong>${emailForm.new_email}</strong>` })"></div>
              </div>

              <div>
                <label class="block text-xs font-bold text-navy tracking-wider mb-1.5">{{ t('settings.verification_code', 'Kode Verifikasi OTP') }}</label>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <Icon icon="ph:key-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="emailForm.otp" type="text" maxlength="6" placeholder="000000"
                      class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black tracking-[0.5em] focus:outline-none focus:border-primary transition-all text-navy" />
                  </div>
                  <BaseButton variant="gold" size="md" @click="verifyEmailChange" :loading="isVerifyingOTP"
                    :disabled="emailForm.otp.length < 6">
                    {{ t('settings.verify_change', 'Verifikasi & Simpan') }}
                  </BaseButton>
                </div>
              </div>

              <button @click="otpSent = false"
                class="text-xs font-bold text-gray-400 hover:text-navy transition-colors">
                {{ t('settings.use_different_email', 'Gunakan email lain') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Password Status -->
        <div class="p-4 rounded-xl border-2 mb-6"
          :class="hasPassword ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'">
          <div class="flex items-center gap-3">
            <Icon :icon="hasPassword ? 'ph:check-circle-fill' : 'ph:warning-circle-fill'"
              :class="hasPassword ? 'text-green-500' : 'text-amber-500'" class="text-2xl" />
            <div>
              <div class="font-bold text-sm" :class="hasPassword ? 'text-green-700' : 'text-amber-700'">
                {{ passwordStatusLabel }}
              </div>
              <div class="text-xs" :class="hasPassword ? 'text-green-600' : 'text-amber-600'">
                {{ passwordStatusDescription }}
              </div>
            </div>
          </div>
        </div>

        <!-- Change Password Form -->
        <div class="pt-8 border-t border-gray-100">
          <h4 class="text-sm font-black text-navy tracking-widest mb-6 flex items-center gap-2">
            <Icon icon="ph:lock-key-bold" class="text-primary" />
            {{ hasPassword ? t('settings.change_password', 'Ubah Kata Sandi') : t('settings.set_password', 'Atur Kata Sandi') }}
          </h4>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <BaseInput v-model="securityForm.new_password" :label="t('settings.new_password', 'Kata Sandi Baru')" type="password"
                placeholder="••••••••" required />
              <BaseInput v-model="securityForm.confirm_password" :label="t('settings.confirm_password', 'Konfirmasi Kata Sandi')" type="password"
                placeholder="••••••••" required />
            </div>

            <div class="pt-4 border-t border-gray-50">
              <BaseButton variant="primary" size="md" icon="ph:lock-key" @click="changePassword"
                :loading="isChangingPassword" :disabled="!securityForm.new_password">
                {{ hasPassword ? t('settings.change_password', 'Ubah Kata Sandi') : t('settings.set_password', 'Atur Kata Sandi') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: Tema -->
    <div v-show="activeTab === 'theme'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
      <h3 class="text-xl font-black text-navy mb-2 flex items-center justify-between">
        {{ t('settings.theme_title', 'Tema & Tampilan Dashboard') }}
        <Icon v-if="isSyncing" icon="ph:circle-notch" class="animate-spin text-primary" />
      </h3>
      <div class="text-gray-500 text-sm mb-6">{{ t('settings.theme_subtitle', 'Pilih tema tampilan dashboard.') }}</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(theme, key) in themes" :key="key" @click="currentTheme = key"
          :class="currentTheme === key ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'"
          class="p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4">
          <div class="h-10 w-10 rounded-xl flex items-center justify-center text-white"
            :style="{ backgroundColor: theme.sidebarBg }">
            <Icon icon="ph:palette-bold" class="text-lg" />
          </div>
          <div class="flex-1">
            <div class="font-bold text-navy capitalize">{{ key }}</div>
            <div class="text-xs text-gray-400 capitalize">{{ t('settings.theme_look', { name: key }) }}</div>
          </div>
          <div class="h-5 w-5 rounded-full border-2 flex items-center justify-center"
            :class="currentTheme === key ? 'border-primary bg-primary text-navy' : 'border-gray-300'">
            <Icon v-if="currentTheme === key" icon="ph:check-bold" class="text-xs" />
          </div>
        </div>
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
import { useTheme } from '~/composables/useTheme'
import useDashboardI18n from '~/composables/useDashboardI18n'

definePageMeta({
  title: 'Pengaturan',
  layout: 'dashboard'
})

const { t } = useDashboardI18n()

useHead({
  title: computed(() => `${t('settings.title', 'Pengaturan')} - Archeris Dashboard`)
})

const { user } = useAuth()
const { get, put } = useApi()
const toast = useToast()
const { currentTheme, themes, isSyncing } = useTheme()

const tabs = computed(() => [
  { label: t('settings.tab_security', 'Keamanan Akun'), value: 'security', icon: 'ph:shield-check' },
  { label: t('settings.tab_theme', 'Tema & Tampilan'), value: 'theme', icon: 'ph:palette' },
])

const activeTab = ref('security')
const isRequestingOTP = ref(false)
const isVerifyingOTP = ref(false)
const otpSent = ref(false)
const emailForm = ref({
  new_email: '',
  otp: ''
})

const isChangingPassword = ref(false)
const userData = ref(null)

const securityForm = ref({
  new_password: '',
  confirm_password: ''
})

const hasPassword = computed(() => userData.value?.has_password ?? false)

const passwordStatusLabel = computed(() => {
  return hasPassword.value
    ? t('settings.password_set_label', 'Kata Sandi Telah Diatur')
    : t('settings.password_not_set_label', 'Belum Ada Kata Sandi')
})

const passwordStatusDescription = computed(() => {
  return hasPassword.value
    ? t('settings.password_set_desc', 'Akun Anda sudah memiliki kata sandi. Anda dapat mengubahnya kapan saja.')
    : t('settings.password_not_set_desc', 'Anda masuk menggunakan Google OAuth. Buat kata sandi baru untuk login via email dan kata sandi.')
})

onMounted(async () => {
  try {
    const response = await get('/user/profile')
    userData.value = response
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
})

const changePassword = async () => {
  if (securityForm.value.new_password !== securityForm.value.confirm_password) {
    toast.error(t('settings.toast_password_mismatch', 'Konfirmasi kata sandi tidak cocok'))
    return
  }

  if (securityForm.value.new_password.length < 6) {
    toast.error(t('settings.toast_password_length', 'Kata sandi minimal 6 karakter'))
    return
  }

  isChangingPassword.value = true
  try {
    await put('/user/password', {
      new_password: securityForm.value.new_password
    })

    toast.success(t('settings.toast_password_success', 'Kata sandi berhasil diperbarui!'))

    securityForm.value = {
      new_password: '',
      confirm_password: ''
    }
    if (userData.value) {
      userData.value.has_password = true
    }
  } catch (error) {
    console.error('Failed to change password:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || t('settings.toast_password_error', 'Gagal memperbarui kata sandi')
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
    toast.success(t('settings.toast_otp_sent', 'Kode OTP telah dikirim ke email baru Anda'))
  } catch (error) {
    const errorMsg = error?.data?.error || t('settings.toast_otp_error', 'Gagal mengirim kode OTP')
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

    toast.success(response.message || t('settings.toast_save_success', 'Email berhasil diubah!'))

    if (userData.value) userData.value.email = emailForm.value.new_email

    otpSent.value = false
    emailForm.value = { new_email: '', otp: '' }
  } catch (error) {
    const errorMsg = error?.data?.error || t('settings.toast_verify_error', 'Kode OTP tidak valid atau kedaluwarsa')
    toast.error(errorMsg)
  } finally {
    isVerifyingOTP.value = false
  }
}
</script>
