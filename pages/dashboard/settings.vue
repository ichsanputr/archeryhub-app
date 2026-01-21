<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-black text-navy">Pengaturan</h1>
      <p class="text-text-secondary mt-1 font-medium">Kelola profil dan preferensi akun Anda</p>
    </div>

    <!-- Settings Nav Tabs -->
    <div class="flex gap-2 border-b border-gray-100 overflow-x-auto no-scrollbar pb-1">
      <BaseButton v-for="tab in tabs" :key="tab.value" variant="ghost" size="sm" :class="[
        'rounded-none border-b-2 font-bold !px-5 !py-4 transition-all',
        activeTab === tab.value ? 'border-primary text-navy bg-primary/5' : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'
      ]" @click="activeTab = tab.value">
        <Icon :icon="tab.icon" class="mr-2" />
        {{ tab.label }}
      </BaseButton>
    </div>

    <!-- Profile Settings (NEW) -->
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
          <h3 class="text-xl font-bold text-navy">{{ user?.name || user?.full_name || 'Pengguna' }}</h3>
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
          <BaseInput v-model="profile.fullName" label="Nama Lengkap" placeholder="Sesuai KTP" required />
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

    <!-- Save Button -->
    <div class="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
      <BaseButton variant="outline" size="lg">
        Batal
      </BaseButton>
      <BaseButton variant="gold" size="lg" icon="ph:floppy-disk" @click="saveSettings" :loading="isSaving">
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
const userType = computed(() => user.value?.role || user.value?.user_type || 'archer')
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
  { label: 'Umum', value: 'general', icon: 'ph:gear' },
  { label: 'Notifikasi', value: 'notifications', icon: 'ph:bell' },
]

// Profile data based on user type
const profile = ref({
  // Archer fields
  fullName: user.value?.name || user.value?.full_name || '',
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
  establishedDate: user.value?.established_date || '',
  headCoachName: user.value?.head_coach_name || '',
  headCoachPhone: user.value?.head_coach_phone || '',
  province: user.value?.province || '',
  address: user.value?.address || ''
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
    // Build payload based on user type
    const payload = {
      profile_completed: true,
      ...profile.value
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
</script>
