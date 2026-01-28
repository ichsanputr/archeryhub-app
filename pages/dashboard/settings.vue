<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-black text-navy">Pengaturan</h1>
      <p class="text-text-secondary mt-1 font-medium">Kelola profil dan preferensi akun Anda</p>
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

    <!-- Profile Settings -->
    <div v-if="activeTab === 'profile'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">

      <!-- Profile Header -->
      <div class="flex items-center gap-6 pb-6 border-b border-gray-100">
        <div class="relative">
          <div
            class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-primary/20">
            <img v-if="user?.avatar_url" :src="user.avatar_url" class="w-full h-full object-cover" />
            <Icon v-else icon="ph:user" class="text-4xl text-primary" />
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold text-navy">{{ user?.full_name || 'Pengguna' }}</h3>
          <p class="text-gray-500">{{ user?.email }}</p>
          <span
            class="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary-dark">
            <Icon :icon="userTypeIcon" />
            {{ userTypeLabel }}
          </span>
        </div>
      </div>

      <!-- Archer Profile Fields -->
      <div v-if="userType === 'archer'" class="space-y-6">
        <h4 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
          <Icon icon="ph:user-bold" class="text-primary" />
          Data Pemanah
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="profile.fullName" label="Nama Lengkap" placeholder="Masukkan Nama Anda" required />
          <BaseInput v-model="profile.nickname" label="Nama Panggilan" placeholder="Nick" />
          <BaseInput v-model="profile.dateOfBirth" label="Tanggal Lahir" type="date" required />
          <BaseSelect v-model="profile.gender" label="Jenis Kelamin" :items="[
            { title: 'Laki-laki', value: 'male' },
            { title: 'Perempuan', value: 'female' }
          ]" required />
          <BaseInput v-model="profile.phone" label="No. Telepon" type="tel" placeholder="08xxxxxxxxxx" required />
          <BaseSelect v-model="profile.bowType" label="Jenis Busur" :items="[
            { title: 'Recurve', value: 'recurve' },
            { title: 'Compound', value: 'compound' },
            { title: 'Barebow', value: 'barebow' },
            { title: 'Tradisional', value: 'traditional' }
          ]" required />
          <BaseInput v-model="profile.city" label="Kota/Kabupaten" placeholder="Contoh: Jakarta Selatan" />
          <BaseInput v-model="profile.country" label="Negara" placeholder="Indonesia" />
        </div>
      </div>

      <!-- Organization Profile Fields -->
      <div v-if="userType === 'organization'" class="space-y-6">
        <h4 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
          <Icon icon="ph:buildings-bold" class="text-primary" />
          Data Organisasi
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <BaseInput v-model="profile.organizationName" label="Nama Organisasi" placeholder="Nama resmi organisasi"
              required />
          </div>
          <BaseInput v-model="profile.acronym" label="Singkatan" placeholder="Contoh: PERPANI" />
          <BaseSelect v-model="profile.organizationType" label="Tipe Organisasi" :items="[
            { title: 'Federasi', value: 'federation' },
            { title: 'Asosiasi', value: 'association' },
            { title: 'Panitia', value: 'committee' },
            { title: 'Sponsor', value: 'sponsor' },
            { title: 'Lainnya', value: 'other' }
          ]" required />
          <BaseInput v-model="profile.contactPersonName" label="Nama PIC" placeholder="Nama penanggung jawab"
            required />
          <BaseInput v-model="profile.contactPersonPhone" label="No. Telepon PIC" type="tel" placeholder="08xxxxxxxxxx"
            required />
          <div class="md:col-span-2">
            <BaseInput v-model="profile.address" label="Alamat" placeholder="Alamat lengkap kantor" />
          </div>
        </div>
      </div>

      <!-- Club Profile Fields -->
      <div v-if="userType === 'club'" class="space-y-6">
        <h4 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
          <Icon icon="ph:users-three-bold" class="text-primary" />
          Data Klub
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <BaseInput v-model="profile.clubName" label="Nama Klub" placeholder="Nama resmi klub" required />
          </div>
          <BaseInput v-model="profile.abbreviation" label="Singkatan" placeholder="Contoh: JVAC" />
          <BaseInput v-model="profile.establishedDate" label="Tahun Berdiri" type="date" />
          <BaseInput v-model="profile.headCoachName" label="Nama Kepala Pelatih" placeholder="Nama pelatih utama"
            required />
          <BaseInput v-model="profile.headCoachPhone" label="No. Telepon Pelatih" type="tel" placeholder="08xxxxxxxxxx"
            required />
          <BaseInput v-model="profile.city" label="Kota" placeholder="Lokasi klub" required />
          <BaseInput v-model="profile.province" label="Provinsi" placeholder="Provinsi" />
          <div class="md:col-span-2">
            <BaseInput v-model="profile.address" label="Alamat Latihan" placeholder="Alamat lengkap tempat latihan" />
          </div>

          <!-- Contact & Social Media -->
          <h4 class="md:col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest mt-4">
            Kontak & Sosial Media
          </h4>
          <BaseInput v-model="profile.email" label="Email Klub" placeholder="email@klub.com" type="email" />
          <BaseInput v-model="profile.phone" label="No. Telepon Official" placeholder="08xxxxxxxxxx" />
          <BaseInput v-model="profile.website" label="Website" placeholder="https://..." />
          <BaseInput v-model="profile.socialInstagram" label="Instagram (Username)" placeholder="@username" />
          <BaseInput v-model="profile.socialFacebook" label="Facebook (URL)" placeholder="https://facebook.com/..." />
          <BaseInput v-model="profile.whatsapp" label="WhatsApp" placeholder="08xxxxxxxxxx" />

          <!-- About & Schedule -->
          <h4 class="md:col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest mt-4">
            Informasi Tambahan
          </h4>
          <div class="md:col-span-2">
            <BaseTextarea v-model="profile.description" label="Deskripsi Klub"
              placeholder="Ceritakan tentang klub Anda, sejarah, dan pencapaian..." :rows="4" />
          </div>
          <div class="md:col-span-2">
            <BaseTextarea v-model="profile.trainingSchedule" label="Jadwal Latihan"
              placeholder="Contoh: Senin & Rabu: 16:00 - 18:00, Sabtu: 08:00 - 11:00" :rows="3" />
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
                  <p class="text-xs text-gray-400">{{ user?.email }}</p>
                </div>
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">Terhubung</span>
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
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({
  title: 'Pengaturan',
  layout: 'dashboard'
})

const { user, fetchUser } = useAuth()
const { put } = useApi()
const toast = useToast()

const activeTab = ref('profile')
const isSaving = ref(false)

// Determine user type
const userType = computed(() => user.value?.role || user.value?.type || 'archer')
const userTypeLabel = computed(() => {
  const labels = { archer: 'Pemanah', organization: 'Organisasi', club: 'Klub', admin: 'Admin' }
  return labels[userType.value] || 'Pengguna'
})
const userTypeIcon = computed(() => {
  const icons = { archer: 'ph:user', organization: 'ph:buildings', club: 'ph:users-three', admin: 'ph:shield-star' }
  return icons[userType.value] || 'ph:user'
})

const tabs = [
  { label: 'Profil', value: 'profile', icon: 'ph:user-circle' },
  { label: 'Keamanan', value: 'security', icon: 'ph:shield-check' },
  { label: 'Umum', value: 'general', icon: 'ph:gear' },
  { label: 'Notifikasi', value: 'notifications', icon: 'ph:bell' },
]

// Profile data based on user type
const profile = ref({
  // Archer fields
  fullName: user.value?.full_name || user.value?.name || '',
  nickname: user.value?.nickname || '',
  dateOfBirth: user.value?.date_of_birth || '',
  gender: user.value?.gender || 'male',
  phone: user.value?.phone || '',
  bowType: user.value?.bow_type || 'recurve',
  city: user.value?.city || '',
  country: user.value?.country || 'ID',
  // Organization fields
  organizationName: user.value?.organization_name || user.value?.name || '',
  acronym: user.value?.acronym || '',
  organizationType: user.value?.organization_type || 'association',
  contactPersonName: user.value?.contact_person_name || '',
  contactPersonPhone: user.value?.contact_person_phone || '',
  // Club fields
  clubName: user.value?.club_name || user.value?.name || '',
  abbreviation: user.value?.abbreviation || '',
  establishedDate: user.value?.established_year ? `${user.value.established_year}-01-01` : '',
  headCoachName: user.value?.head_coach_name || '',
  headCoachPhone: user.value?.head_coach_phone || '',
  province: user.value?.province || '',
  address: user.value?.address || '',
  email: user.value?.email || '',
  website: user.value?.website || '',
  socialInstagram: user.value?.social_instagram || '',
  socialFacebook: user.value?.social_facebook || '',
  whatsapp: user.value?.phone || '',
  description: user.value?.description || '',
  trainingSchedule: user.value?.training_schedule || ''
})

const settings = ref({
  language: 'id',
  timezone: 'Asia/Jakarta',
  emailNotifications: true,
  pushNotifications: true,
})

const saveSettings = async () => {
  isSaving.value = true
  try {
    const payload = {
      profile_completed: true,
      ...profile.value,
      // Map to backend fields
      name: profile.value.clubName,
      social_instagram: profile.value.socialInstagram,
      social_facebook: profile.value.socialFacebook,
      training_schedule: profile.value.trainingSchedule,
      head_coach_name: profile.value.headCoachName,
      head_coach_phone: profile.value.headCoachPhone
    }

    await put('/user/profile', payload)
    await fetchUser()
    toast.success('Profil berhasil disimpan')
  } catch (error) {
    console.error('Failed to save profile:', error)
    toast.error('Gagal menyimpan profil')
  } finally {
    isSaving.value = false
  }
}

// Password handling for OAuth users
const hasPassword = computed(() => user.value?.has_password || false)
const passwordStatusLabel = computed(() => hasPassword.value ? 'Password Sudah Diatur' : 'Password Belum Diatur')
const passwordStatusDescription = computed(() => hasPassword.value
  ? 'Anda dapat login dengan email dan password'
  : 'Atur password untuk bisa login tanpa Google'
)
const isSavingPassword = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

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
    await fetchUser()
  } catch (error) {
    console.error('Failed to save password:', error)
    toast.error('Gagal menyimpan password: ' + (error.message || 'Terjadi kesalahan'))
  } finally {
    isSavingPassword.value = false
  }
}
</script>
