<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-black text-navy">Pengaturan Akun</h1>
      <p class="text-text-secondary mt-1 font-medium">Kelola kredensial dan keamanan akun Anda</p>
    </div>

    <!-- Settings Nav Tabs -->
    <div class="flex gap-2 border-b border-gray-100 overflow-x-auto no-scrollbar pb-1">
      <div v-for="tab in tabs" :key="tab.value" role="button"
        class="inline-flex items-center gap-2 font-bold text-sm px-5 py-4 border-b-2 rounded-none transition-all cursor-pointer"
        :class="activeTab === tab.value
          ? 'border-primary text-navy bg-primary/5'
          : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'" @click="activeTab = tab.value">
        <Icon :icon="tab.icon" class="mr-1 text-base" />
        <span>{{ tab.label }}</span>
      </div>
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
            class="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary-dark">
            <Icon :icon="userTypeIcon" />
            {{ userTypeLabel }}
          </span>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-navy mb-2">Informasi Akun</h3>
        <p class="text-gray-500 text-sm mb-6">Data dasar akun Anda</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="accountForm.email" label="Email" type="email" placeholder="email@example.com" disabled />
          <BaseInput v-model="accountForm.username" label="Username" placeholder="username" />
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
          <h4 class="text-sm font-black text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
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
                  <p class="font-bold text-navy">Google</p>
                  <p class="text-xs text-gray-400">{{ userData?.email }}</p>
                </div>
              </div>
              <span v-if="userData?.google_id"
                class="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">Terhubung</span>
              <span v-else class="px-3 py-1 bg-gray-200 text-gray-500 text-xs font-bold rounded-full">Tidak
                Terhubung</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <Icon icon="ph:envelope-bold" class="text-xl text-gray-400" />
                </div>
                <div>
                  <p class="font-bold text-navy">Email & Password</p>
                  <p class="text-xs text-gray-400">Login dengan email dan password</p>
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

        <!-- Set Password Form -->
        <div class="border-t border-gray-100 pt-8">
          <h4 class="text-sm font-black text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icon icon="ph:key-bold" class="text-primary" />
            {{ hasPassword ? 'Ubah Password' : 'Atur Password Baru' }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput v-if="hasPassword" v-model="passwordForm.currentPassword" label="Password Saat Ini"
              type="password" placeholder="Masukkan password saat ini" required />
            <div v-if="hasPassword"></div>
            <BaseInput v-model="passwordForm.newPassword" label="Password Baru" type="password"
              placeholder="Minimal 6 karakter" required />
            <BaseInput v-model="passwordForm.confirmPassword" label="Konfirmasi Password" type="password"
              placeholder="Ulangi password baru" required />
          </div>
          <div class="mt-6">
            <BaseButton variant="gold" size="md" icon="ph:key" @click="savePassword" :loading="isSavingPassword">
              {{ hasPassword ? 'Ubah Password' : 'Atur Password' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h3 class="text-xl font-bold text-navy mb-6">Pengaturan Umum</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BaseSelect v-model="settings.language" label="Bahasa" :items="[
            { title: 'English', value: 'en' },
            { title: 'Bahasa Indonesia', value: 'id' }
          ]" />

          <BaseSelect v-model="settings.timezone" label="Zona Waktu" :items="[
            { title: 'Asia/Jakarta (WIB)', value: 'Asia/Jakarta' },
            { title: 'Asia/Makassar (WITA)', value: 'Asia/Makassar' },
            { title: 'Asia/Jayapura (WIT)', value: 'Asia/Jayapura' }
          ]" />
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div v-if="activeTab === 'notifications'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h3 class="text-xl font-bold text-navy mb-6">Preferensi Notifikasi</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseCheckbox v-model="settings.emailNotifications" label="Notifikasi Email" />
          <BaseCheckbox v-model="settings.pushNotifications" label="Notifikasi Push" />
          <BaseCheckbox v-model="settings.eventUpdates" label="Update Event" />
          <BaseCheckbox v-model="settings.registrationNotifications" label="Notifikasi Pendaftaran" />
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
      <BaseButton variant="outline" size="md">
        Batal
      </BaseButton>
      <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveSettings" :loading="isSaving">
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

definePageMeta({
  title: 'Pengaturan',
  layout: 'dashboard',
  middleware: ['auth']
})

useHead({
  title: 'Pengaturan Akun - ArcheryHub Dashboard'
})

const { user, fetchUser } = useAuth()
const { get, put } = useApi()
const toast = useToast()

const tabs = computed(() => {
  const allTabs = [
    { label: 'Akun', value: 'account', icon: 'ph:user-circle' },
    { label: 'Keamanan', value: 'security', icon: 'ph:shield-check' },
    { label: 'Umum', value: 'general', icon: 'ph:gear' },
    { label: 'Notifikasi', value: 'notifications', icon: 'ph:bell' },
  ]

  if (user.value?.role === 'organization') {
    return allTabs.filter(t => t.value !== 'account')
  }
  return allTabs
})

const activeTab = ref(user.value?.role === 'organization' ? 'security' : 'account')
const isSaving = ref(false)
const isSavingPassword = ref(false)
const userData = ref(null)

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
  username: ''
})

const settings = ref({
  language: 'id',
  timezone: 'Asia/Jakarta',
  emailNotifications: true,
  pushNotifications: true,
  eventUpdates: true,
  registrationNotifications: true
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Load user data
onMounted(async () => {
  try {
    const response = await get('/user/profile')
    userData.value = response
    accountForm.value.email = response.email || ''
    accountForm.value.username = response.username || ''
  } catch (error) {
    console.error('Failed to load user data:', error)
    toast.error('Gagal memuat data pengguna')
  }
})

const saveSettings = async () => {
  isSaving.value = true
  try {
    await put('/user/profile', {
      username: accountForm.value.username
    })
    await fetchUser()
    toast.success('Pengaturan berhasil disimpan')
  } catch (error) {
    console.error('Failed to save settings:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal menyimpan pengaturan'
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

// Password handling
const hasPassword = computed(() => userData.value?.has_password || false)
const passwordStatusLabel = computed(() => hasPassword.value ? 'Password Sudah Diatur' : 'Password Belum Diatur')
const passwordStatusDescription = computed(() => hasPassword.value
  ? 'Anda dapat login dengan email dan password'
  : 'Atur password untuk bisa login tanpa Google'
)

const savePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('Password baru tidak cocok')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    toast.error('Password minimal 6 karakter')
    return
  }

  isSavingPassword.value = true
  try {
    await put('/user/password', {
      current_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword
    })
    toast.success(hasPassword.value ? 'Password berhasil diubah' : 'Password berhasil diatur')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }

    // Reload user data to update has_password flag
    const response = await get('/user/profile')
    userData.value = response
  } catch (error) {
    console.error('Failed to save password:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Terjadi kesalahan'
    toast.error('Gagal menyimpan password: ' + errorMessage)
  } finally {
    isSavingPassword.value = false
  }
}
</script>
