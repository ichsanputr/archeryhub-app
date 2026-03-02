<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight">Profil Pemanah</h1>
        <p class="text-gray-500 mt-1 font-medium">Atur informasi publik yang akan ditampilkan di profil Anda</p>
      </div>
      <div class="flex gap-3">
        <BaseButton v-if="user?.username" variant="outline" size="sm" icon="ph:eye" @click="previewProfile">
          Pratinjau Publik
        </BaseButton>
        <BaseButton variant="gold" size="sm" icon="ph:floppy-disk" @click="saveProfile" :loading="isSaving">
          Simpan Profil
        </BaseButton>
      </div>
    </div>

    <div class="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5 overflow-x-auto no-scrollbar shadow-sm">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-white shadow text-navy' : 'text-gray-500 hover:text-navy hover:bg-white/50'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[140px] px-5 py-2.5 rounded-xl text-sm font-black transition-all">
        <Icon :icon="tab.icon" class="text-lg" />
        {{ tab.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Tab: Informasi (Personal Data) -->
        <div v-if="activeTab === 'information'" class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy  tracking-widest flex items-center gap-2">
              <Icon icon="ph:user-circle" class="text-black text-xl" />
              Data Pribadi
            </h3>
            <p class="text-sm text-gray-600">
              Informasi ini akan digunakan untuk keperluan administrasi event dan tampilan profil publik.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <BaseInput v-model="accountForm.full_name" label="Nama Lengkap" placeholder="Nama lengkap Anda"
                required />
              <BaseInput v-model="accountForm.username" label="Username" placeholder="username"
                hint="Untuk URL profil publik" />

              <BaseInput v-model="accountForm.date_of_birth" label="Tanggal Lahir" type="date"
                icon="mingcute:calendar-line" />
              <BaseSelect v-model="accountForm.gender" label="Jenis Kelamin" :items="[
                { title: 'Laki-laki', value: 'male' },
                { title: 'Perempuan', value: 'female' }
              ]" icon="ph:gender-intersex" />

              <BaseInput v-model="accountForm.phone" label="Nomor Telepon" type="tel" placeholder="+62 812-3456-7890"
                icon="ph:phone" />
              <BaseSelect v-model="accountForm.city" label="Kota / Kabupaten" :items="cityOptions"
                placeholder="Pilih kota" icon="mingcute:building-2-line" />

              <BaseInput v-model="accountForm.school" label="Sekolah / Universitas"
                placeholder="Nama sekolah / universitas" icon="ph:student" />
              <BaseSelect v-model="accountForm.bow_type" label="Tipe Busur" :items="[
                { title: 'Recurve', value: 'recurve' },
                { title: 'Compound', value: 'compound' },
                { title: 'Barebow', value: 'barebow' },
                { title: 'Traditional', value: 'traditional' }
              ]" icon="hugeicons:archer" />

              <div class="md:col-span-2">
                <BaseTextarea v-model="accountForm.address" label="Alamat Lengkap" placeholder="Alamat lengkap Anda"
                  :rows="3" icon="ph:house" />
              </div>
            </div>

            <div class="flex justify-end mt-6 pt-6 border-t border-gray-100">
              <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveAccountInfo"
                :loading="isSavingAccount">
                Simpan Informasi
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Tab: Profil (Bio, Prestasi, Riwayat Event) -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <!-- Bio Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
              <Icon icon="ph:identification-card-bold" class="text-primary text-xl" />
              TENTANG SAYA
            </h3>
            <div class="space-y-4">
              <BaseTextarea v-model="profile.bio" label="Deskripsi Diri"
                placeholder="Ceritakan sejarah panahan Anda, filosofi, atau informasi menarik lainnya..." :rows="5" />
              <p class="text-[10px] text-gray-400 font-medium italic">
                * Bio akan ditampilkan di halaman profil publik Anda untuk dilihat oleh klub dan penyelenggara event.
              </p>
            </div>
          </div>

          <!-- Achievements Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
              <Icon icon="ph:medal-bold" class="text-primary text-xl" />
              PRESTASI & PENGHARGAAN
            </h3>
            <div class="space-y-4">
              <BaseTextarea v-model="profile.achievements" label="Daftar Prestasi"
                placeholder="Contoh: Juara 1 Kejurnas 2023, Pemanah Terbaik Piala Walikota..." :rows="6" />
              <p class="text-[10px] text-gray-400 font-medium italic">
                * Masukkan prestasi Anda (satu per baris atau gunakan format teks bebas).
              </p>
            </div>
          </div>

          <!-- Event History Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
              <Icon icon="ph:calendar-check-bold" class="text-primary text-xl" />
              RIWAYAT EVENT
            </h3>
            <div class="space-y-4">
              <p class="text-sm text-gray-600">
                Riwayat event akan otomatis ditampilkan dari data event yang Anda ikuti.
              </p>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-sm text-gray-500">
                  Total event yang diikuti: <span class="font-bold text-navy">{{ userStats.totalEvents || 0 }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Kontak & Sosial -->
        <div v-if="activeTab === 'contact'" class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
              <Icon icon="ph:phone-bold" class="text-primary text-xl" />
              KONTAK
            </h3>
            <div class="space-y-4">
              <p class="text-sm text-gray-600">
                Informasi kontak Anda yang dapat dihubungi oleh penyelenggara event.
              </p>
              <div class="p-4 bg-gray-50 rounded-xl space-y-3">
                <div v-if="accountForm.email" class="flex items-center gap-3">
                  <Icon icon="ph:envelope" class="text-primary" />
                  <span class="text-sm text-gray-700 font-medium">{{ accountForm.email }}</span>
                </div>
                <div v-if="accountForm.phone" class="flex items-center gap-3">
                  <Icon icon="ph:phone" class="text-primary" />
                  <span class="text-sm text-gray-700 font-medium">{{ accountForm.phone }}</span>
                </div>
                <div v-if="accountForm.address" class="flex items-start gap-3 border-t border-gray-200/50 pt-3 mt-1">
                  <Icon icon="ph:map-pin" class="text-primary mt-0.5" />
                  <span class="text-sm text-gray-700 leading-relaxed font-medium">{{ accountForm.address }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2">
              <Icon icon="ph:share-network-bold" class="text-primary text-xl" />
              MEDIA SOSIAL
            </h3>
            <div class="space-y-4">
              <p class="text-sm text-gray-600">Tautkan akun media sosial Anda untuk dilihat oleh publik.</p>
              <div class="grid grid-cols-1 gap-4 mt-2">
                <div class="space-y-2">
                  <label class="text-xs font-black text-navy uppercase tracking-widest pl-1">WhatsApp</label>
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                      <Icon icon="ph:whatsapp-logo" class="text-green-600 text-xl" />
                    </div>
                    <input v-model="profile.social_whatsapp" type="text" placeholder="Contoh: 081234567890"
                      class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-black text-navy uppercase tracking-widest pl-1">Instagram</label>
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 border border-pink-100">
                      <Icon icon="ph:instagram-logo" class="text-pink-600 text-xl" />
                    </div>
                    <input v-model="profile.social_instagram" type="text" placeholder="@username_instagram"
                      class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-black text-navy uppercase tracking-widest pl-1">TikTok</label>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                      <Icon icon="ph:tiktok-logo" class="text-white text-xl" />
                    </div>
                    <input v-model="profile.social_tiktok" type="text" placeholder="@username_tiktok"
                      class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Sidebar -->
      <div class="space-y-6">
        <!-- Profile Card Preview -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
          <div class="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div class="flex flex-col items-center text-center mt-4">
            <div class="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 p-1 mb-4 overflow-hidden">
              <img :src="useImageOrDefault(user?.avatar_url, user?.full_name)"
                class="w-full h-full object-cover rounded-full" />
            </div>
            <h4 class="font-black text-navy text-lg leading-tight">{{ user?.full_name }}</h4>
            <p class="text-gray-400 text-xs font-bold  tracking-tighter mt-1">{{ user?.username }}</p>

            <div v-if="profile.bio" class="mt-4 px-2">
              <p class="text-xs text-gray-500 italic line-clamp-3">"{{ profile.bio }}"</p>
            </div>

            <div class="w-full h-px bg-gray-50 my-6"></div>

            <div class="grid grid-cols-2 w-full gap-4">
              <div class="text-center">
                <p class="text-[10px] font-black text-gray-400  tracking-widest">Events</p>
                <p class="text-navy font-black">{{ userStats.totalEvents || 0 }}</p>
              </div>
              <div class="text-center border-l border-gray-50">
                <p class="text-[10px] font-black text-gray-400  tracking-widest">Best Score</p>
                <p class="text-navy font-black">{{ userStats.bestScore || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Helpful Tips -->
        <div class="bg-navy rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <Icon icon="ph:lightbulb" class="absolute -right-4 -bottom-4 text-8xl text-white/5 rotate-12" />
          <h4 class="font-black text-white mb-3 flex items-center gap-2">Tips Profil</h4>
          <ul class="text-xs space-y-3 text-gray-300 font-medium">
            <li class="flex gap-2">
              <Icon icon="ph:check-circle-fill" class="text-white shrink-0 text-base" />
              Gunakan foto profil yang profesional dengan peralatan panah Anda.
            </li>
            <li class="flex gap-2">
              <Icon icon="ph:check-circle-fill" class="text-white shrink-0 text-base" />
              Cantumkan prestasi terbaru di bagian paling atas.
            </li>
            <li class="flex gap-2">
              <Icon icon="ph:check-circle-fill" class="text-white shrink-0 text-base" />
              Bio yang menarik membantu klub mengenal karakter Anda.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Profil Pemanah - ArcheryHub Dashboard'
})

const { user, archerProfile } = useAuth()
const { get, put } = useApi()
const toast = useToast()

const isSaving = ref(false)
const isSavingAccount = ref(false)
const profile = ref({
  bio: '',
  achievements: '',
  social_instagram: '',
  social_tiktok: '',
  social_whatsapp: ''
})

const accountForm = ref({
  full_name: '',
  username: '',
  date_of_birth: '',
  gender: '',
  phone: '',
  city: '',
  school: '',
  bow_type: '',
  address: ''
})

const cityOptions = ref([])

const userStats = ref({
  totalEvents: 0,
  bestScore: null
})

// Available section types
const allSections = [
  {
    type: 'bio',
    label: 'Tentang Saya',
    description: 'Ceritakan tentang diri Anda',
    icon: 'ph:identification-card-bold',
    defaultVisible: true
  },
  {
    type: 'achievements',
    label: 'Prestasi & Penghargaan',
    description: 'Daftar prestasi dan penghargaan',
    icon: 'ph:medal-bold',
    defaultVisible: true
  },
  {
    type: 'contact',
    label: 'Kontak',
    description: 'Informasi kontak',
    icon: 'ph:phone-bold',
    defaultVisible: false
  },
  {
    type: 'social',
    label: 'Media Sosial',
    description: 'Tautan media sosial',
    icon: 'ph:share-network-bold',
    defaultVisible: false
  },
  {
    type: 'equipment',
    label: 'Peralatan',
    description: 'Daftar peralatan panahan',
    icon: 'ph:bow-arrow-bold',
    defaultVisible: false
  },
  {
    type: 'gallery',
    label: 'Galeri',
    description: 'Foto-foto event dan latihan',
    icon: 'ph:images-bold',
    defaultVisible: false
  },
  {
    type: 'event_history',
    label: 'Riwayat Event',
    description: 'Daftar event yang diikuti',
    icon: 'ph:calendar-check-bold',
    defaultVisible: false
  }
]

const activeTab = ref('information')
const tabs = [
  { id: 'information', label: 'Informasi', icon: 'ph:user-circle-bold' },
  { id: 'profile', label: 'Profil', icon: 'ph:identification-card-bold' },
  { id: 'contact', label: 'Kontak & Sosial', icon: 'ph:phone-bold' }
]


// Initialize from user data
onMounted(async () => {

  // Load cities
  try {
    const citiesRes = await get('/cities')
    cityOptions.value = (citiesRes.data || []).map(c => ({ title: c.name, value: c.name }))
  } catch (e) {
    console.error('Failed to load cities:', e)
  }

  // Load profile and account data
  await loadProfile()

  // Use global archerProfile (already loaded by server middleware)
  if (archerProfile.value) {
    const data = archerProfile.value
    profile.value.bio = data.bio || ''
    profile.value.achievements = data.achievements || ''
    profile.value.social_instagram = data.social_instagram || ''
    profile.value.social_tiktok = data.social_tiktok || ''
    profile.value.social_whatsapp = data.social_whatsapp || ''

    // Fetch user stats (this is separate from basic profile)
    try {
      const stats = await get('/archers/me/stats')
      if (stats) {
        userStats.value = {
          totalEvents: stats.total_events || 0
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }
})

// Load profile data
const loadProfile = async () => {
  try {
    const response = await get('/archer/me')

    // Load account information
    accountForm.value = {
      full_name: response.full_name || '',
      username: response.username || '',
      date_of_birth: response.date_of_birth ? new Date(response.date_of_birth).toISOString().split('T')[0] : '',
      gender: response.gender || '',
      phone: response.phone || '',
      city: response.city || '',
      school: response.school || '',
      bow_type: response.bow_type || '',
      address: response.address || ''
    }

  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

// Save account information
const saveAccountInfo = async () => {
  isSavingAccount.value = true
  try {
    await put('/user/profile', accountForm.value)
    toast.success('Informasi berhasil disimpan')
  } catch (error) {
    console.error('Failed to save account info:', error)
    toast.error('Gagal menyimpan informasi')
  } finally {
    isSavingAccount.value = false
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    await put('/user/profile', {
      bio: profile.value.bio,
      achievements: profile.value.achievements,
      social_instagram: profile.value.social_instagram,
      social_tiktok: profile.value.social_tiktok,
      social_whatsapp: profile.value.social_whatsapp
    })
    toast.success('Profil berhasil disimpan')
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan profil')
  } finally {
    isSaving.value = false
  }
}

const previewProfile = () => {
  if (user.value?.username) {
    window.open(`/archers/${user.value.username}`, '_blank')
  } else {
    toast.warning('Username profil belum diatur. Silakan simpan profil terlebih dahulu.')
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
