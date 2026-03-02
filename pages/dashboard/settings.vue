<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-black text-navy">Pengaturan Akun</h1>
      <p class="text-text-secondary mt-1 font-medium">Kelola kredensial dan keamanan akun Anda</p>
    </div>

    <!-- Settings Nav Tabs -->
    <div class="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
      <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
        :class="activeTab === tab.value ? 'bg-white shadow-sm text-navy' : 'text-gray-500 hover:text-navy hover:bg-white/50'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-sm font-black transition-all">
        <Icon :icon="tab.icon" class="text-base" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Account Info -->
    <div v-if="activeTab === 'account'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">

      <!-- Profile Header -->
      <div class="flex items-center gap-6 pb-6 border-b border-gray-100">
        <div class="relative">
          <div
            class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-primary/20">
            <img
              :src="useImageOrDefault(userData?.avatar_url || userData?.logo_url, userData?.full_name || userData?.name)"
              class="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold text-navy">{{ userData?.full_name || userData?.name || 'Pengguna' }}</h3>
          <p class="text-gray-500">{{ userData?.email }}</p>
          <span
            class="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-bold  bg-primary/10 text-primary-dark">
            <Icon :icon="userTypeIcon" />
            {{ userTypeLabel }}
          </span>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-navy mb-2">Informasi Akun</h3>
        <p class="text-gray-500 text-sm mb-6">Data dasar akun Anda</p>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput v-model="accountForm.full_name" label="Nama Lengkap" placeholder="Nama lengkap Anda" required />
            <BaseInput v-model="accountForm.username" label="Username" placeholder="username" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput v-model="accountForm.email" label="Email" type="email" placeholder="email@example.com"
              disabled />
            <BaseInput v-model="accountForm.phone" label="Nomor Telepon" type="tel" placeholder="+62 812-3456-7890" />
          </div>

          <template v-if="userType === 'archer'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="accountForm.date_of_birth" label="Tanggal Lahir" type="date" />
              <BaseSelect v-model="accountForm.gender" label="Jenis Kelamin" :items="[
                { title: 'Laki-laki', value: 'M' },
                { title: 'Perempuan', value: 'F' },
                { title: 'Lainnya', value: 'X' }
              ]" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="accountForm.city" label="Kota" placeholder="Kota tempat tinggal" />
              <BaseInput v-model="accountForm.school" label="Sekolah / Universitas"
                placeholder="Nama sekolah / universitas" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="accountForm.address" label="Alamat" placeholder="Alamat lengkap" />
              <BaseSelect v-model="accountForm.bow_type" label="Tipe Busur" :items="[
                { title: 'Recurve', value: 'recurve' },
                { title: 'Compound', value: 'compound' },
                { title: 'Barebow', value: 'barebow' },
                { title: 'Traditional', value: 'traditional' },
                { title: 'Standard', value: 'standard' }
              ]" />
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="accountForm.city" label="Kota" placeholder="Kota" />
              <BaseInput v-model="accountForm.address" label="Alamat" placeholder="Alamat lengkap" />
            </div>
          </template>

          <div class="mt-6">
            <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveAccountInfo"
              :loading="isSavingAccount">
              Simpan Informasi Akun
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div v-if="activeTab === 'security'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h3 class="text-xl font-bold text-navy mb-2">Keamanan Akun</h3>
        <p class="text-gray-500 text-sm mb-6">Kelola password dan metode login akun Anda</p>

        <!-- Password Status -->
        <div class="p-4 rounded-xl border-2 mb-6"
          :class="hasPassword ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'">
          <div class="flex items-center gap-3">
            <Icon :icon="hasPassword ? 'ph:check-circle-fill' : 'ph:warning-circle-fill'"
              :class="hasPassword ? 'text-green-500' : 'text-amber-500'" class="text-2xl" />
            <div>
              <p class="font-bold" :class="hasPassword ? 'text-green-700' : 'text-amber-700'">
                {{ passwordStatusLabel }}
              </p>
              <p class="text-sm" :class="hasPassword ? 'text-green-600' : 'text-amber-600'">
                {{ passwordStatusDescription }}
              </p>
            </div>
          </div>
        </div>

        <!-- Connected Login Methods -->
        <div class="mb-8">
          <h4 class="text-sm font-black text-navy  tracking-widest mb-4 flex items-center gap-2">
            <Icon icon="ph:link-bold" class="text-primary" />
            Metode Login Terhubung
          </h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <Icon icon="flat-color-icons:google" class="text-xl" />
                </div>
                <div>
                  <p class="font-bold text-navy">Google Login</p>
                  <p class="text-xs text-gray-400">Hubungkan untuk login lebih cepat</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="userData?.google_id"
                  class="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">Terhubung</span>
                <template v-else>
                  <span class="px-3 py-1 bg-gray-200 text-gray-500 text-xs font-bold rounded-full mr-2">Tidak
                    Terhubung</span>
                  <BaseButton variant="outline" size="sm" @click="linkGoogle">
                    Hubungkan
                  </BaseButton>
                </template>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <Icon icon="ph:envelope-bold" class="text-xl text-gray-400" />
                </div>
                <div>
                  <p class="font-bold text-navy">Email & Password</p>
                  <p class="text-xs text-gray-400">Login manual dengan password</p>
                </div>
              </div>
              <span
                :class="hasPassword ? 'px-3 py-1 bg-green-100 text-green-600' : 'px-3 py-1 bg-gray-200 text-gray-500'"
                class="text-xs font-bold rounded-full">
                {{ hasPassword ? 'Aktif' : 'Belum Aktif' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Change Password Form -->
        <div class="pt-8 border-t border-gray-100">
          <h4 class="text-sm font-black text-navy tracking-widest mb-6 flex items-center gap-2">
            <Icon icon="ph:lock-key-bold" class="text-primary" />
            {{ hasPassword ? 'Ganti Password' : 'Setel Password Akun' }}
          </h4>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <BaseInput v-model="securityForm.new_password" label="Password Baru" type="password"
                placeholder="••••••••" required />
              <BaseInput v-model="securityForm.confirm_password" label="Konfirmasi Password Baru" type="password"
                placeholder="••••••••" required />
            </div>

            <div class="pt-4 border-t border-gray-50">
              <BaseButton variant="primary" size="md" icon="ph:lock-key" @click="changePassword"
                :loading="isChangingPassword" :disabled="!securityForm.new_password">
                {{ hasPassword ? 'Perbarui Password' : 'Setel Password' }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Theme Settings -->
    <div v-if="activeTab === 'theme'" class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h3 class="text-xl font-bold text-navy mb-2 flex items-center gap-2">
          Tema Dashboard
          <Icon v-if="isSyncing" icon="ph:circle-notch" class="animate-spin text-primary" />
        </h3>
        <p class="text-gray-500 text-sm mb-6">Pilih palet warna yang sesuai dengan preferensi Anda</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(theme, key) in themes" :key="key" role="button"
            class="relative overflow-hidden rounded-2xl border-2 transition-all group" :class="currentTheme === key
              ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
              : 'border-gray-100 hover:border-gray-300 bg-white'" @click="currentTheme = key">
            <!-- Theme Preview Header -->
            <div class="h-24 w-full flex" :style="{ backgroundColor: theme.sidebarBg }">
              <div class="w-1/4 h-full border-r border-white/10 flex flex-col gap-2 p-3">
                <div class="w-full h-2 rounded bg-white/20"></div>
                <div class="w-2/3 h-2 rounded bg-white/10"></div>
              </div>
              <div class="w-3/4 h-full flex flex-col">
                <div class="h-1/3 w-full bg-white flex items-center px-3">
                  <div class="w-12 h-2 rounded bg-gray-100"></div>
                </div>
                <div class="flex-1 p-3">
                  <div
                    class="h-full w-full rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center"
                    :style="{ color: theme.primary }">
                    <Icon icon="ph:check-circle-fill" v-if="currentTheme === key" class="text-2xl" />
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
              <p class="text-xs text-gray-400 capitalize">{{ key }} theme for professional look</p>
            </div>

            <!-- Selection Indicator -->
            <div v-if="currentTheme === key"
              class="absolute top-2 right-2 flex items-center justify-center bg-white rounded-full p-1 shadow-lg">
              <Icon icon="ph:check-circle-fill" class="text-primary text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
      <BaseButton variant="outline" size="md" @click="resetForm" :loading="isResetting">
        Batal
      </BaseButton>
      <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveSettings" :loading="isSavingGeneral">
        Simpan Perubahan
      </BaseButton>
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

definePageMeta({
  title: 'Pengaturan',
  layout: 'dashboard'
})

useHead({
  title: 'Pengaturan Akun - ArcheryHub Dashboard'
})

const { login, user } = useAuth()
const { get, put } = useApi()
const toast = useToast()
const { currentTheme, themes, isSyncing } = useTheme()
const route = useRoute()

const tabs = computed(() => {
  const allTabs = [
    { label: 'Keamanan', value: 'security', icon: 'ph:shield-check' },
    { label: 'Tema', value: 'theme', icon: 'ph:palette' },
  ]

  if (user.value?.role === 'archer') return allTabs
  if (user.value?.role === 'organization') return allTabs

  return [
    { label: 'Akun', value: 'account', icon: 'ph:user-circle' },
    ...allTabs
  ]
})

const activeTab = ref(user.value?.role === 'archer' || user.value?.role === 'organization' ? 'security' : 'account')
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

const passwordStatusLabel = computed(() => {
  return hasPassword.value ? 'Password Telah Diatur' : 'Password Belum Diatur'
})

const passwordStatusDescription = computed(() => {
  return hasPassword.value
    ? 'Anda dapat login menggunakan kombinasi email dan password.'
    : 'Anda saat ini login menggunakan Google. Setel password untuk mengaktifkan login manual.'
})

// Determine user type
const userType = computed(() => userData.value?.user_type || user.value?.role || user.value?.type || 'archer')
const userTypeLabel = computed(() => {
  const labels = { archer: 'Pemanah', organization: 'Organisasi', club: 'Klub', admin: 'Admin', seller: 'Seller' }
  return labels[userType.value] || 'Pengguna'
})
const userTypeIcon = computed(() => {
  const icons = { archer: 'ph:user', organization: 'ph:buildings', club: 'ph:users-three', admin: 'ph:shield-star', seller: 'ph:storefront' }
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
    toast.error('Gagal menghubungkan: Email Google tidak cocok dengan email akun saat ini.')
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
    toast.error('Gagal memuat data pengguna')
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
    toast.success('Informasi akun berhasil disimpan')

    // Update reset checkpoint
    initialAccountForm.value = JSON.parse(JSON.stringify(accountForm.value))

    // Update local user data if needed
    if (userData.value) {
      userData.value.username = accountForm.value.username
      userData.value.full_name = accountForm.value.full_name
    }
  } catch (error) {
    console.error('Failed to save account info:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal menyimpan informasi'
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
    toast.info('Formulir telah direset ke data asli')
  } finally {
    isResetting.value = false
  }
}

const saveSettings = async () => {
  isSavingGeneral.value = true
  // This is for general settings like language, timezone, notifications
  try {
    // In the future, this should save to /user/settings
    // await put('/user/settings', settings.value)

    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Pengaturan umum berhasil disimpan')
  } catch (error) {
    toast.error('Gagal menyimpan pengaturan')
  } finally {
    isSavingGeneral.value = false
  }
}

const changePassword = async () => {
  if (securityForm.value.new_password !== securityForm.value.confirm_password) {
    toast.error('Konfirmasi password tidak cocok')
    return
  }

  if (securityForm.value.new_password.length < 6) {
    toast.error('Password minimal 6 karakter')
    return
  }

  isChangingPassword.value = true
  try {
    await put('/user/password', {
      new_password: securityForm.value.new_password
    })

    toast.success('Password berhasil diperbarui')

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
    const errorMessage = error?.data?.error || error?.response?.data?.error || 'Gagal memperbarui password'
    toast.error(errorMessage)
  } finally {
    isChangingPassword.value = false
  }
}


</script>
