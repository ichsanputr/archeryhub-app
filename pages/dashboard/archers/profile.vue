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

    <!-- Tab Navigation -->
    <div
      class="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
        'px-5 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap flex items-center gap-2',
        activeTab === tab.id
          ? 'bg-navy text-white shadow-md shadow-navy/20'
          : 'text-gray-400 hover:text-navy hover:bg-gray-50'
      ]">
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
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
              <Icon icon="ph:user-circle" class="text-black text-xl" />
              Data Pribadi
            </h3>
            <p class="text-sm text-gray-600">
              Informasi ini akan digunakan untuk keperluan administrasi event dan tampilan profil publik.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <BaseInput v-model="accountForm.full_name" label="Nama Lengkap" placeholder="Nama lengkap Anda" required />
              <BaseInput v-model="accountForm.username" label="Username" placeholder="username" hint="Untuk URL profil publik" />

              <BaseInput v-model="accountForm.date_of_birth" label="Tanggal Lahir" type="date" icon="mingcute:calendar-line" />
              <BaseSelect v-model="accountForm.gender" label="Jenis Kelamin" :items="[
                { title: 'Laki-laki', value: 'male' },
                { title: 'Perempuan', value: 'female' }
              ]" icon="ph:gender-intersex" />

              <BaseInput v-model="accountForm.phone" label="Nomor Telepon" type="tel" placeholder="+62 812-3456-7890" icon="ph:phone" />
              <BaseSelect v-model="accountForm.city" label="Kota / Kabupaten" :items="cityOptions" placeholder="Pilih kota" icon="mingcute:building-2-line" />

              <BaseInput v-model="accountForm.school" label="Sekolah / Universitas" placeholder="Nama sekolah / universitas" icon="ph:student" />
              <BaseSelect v-model="accountForm.bow_type" label="Tipe Busur" :items="[
                { title: 'Recurve', value: 'recurve' },
                { title: 'Compound', value: 'compound' },
                { title: 'Barebow', value: 'barebow' },
                { title: 'Traditional', value: 'traditional' }
              ]" icon="hugeicons:archer" />

              <div class="md:col-span-2">
                <BaseTextarea v-model="accountForm.address" label="Alamat Lengkap" placeholder="Alamat lengkap Anda" :rows="3" icon="ph:house" />
              </div>
            </div>

            <div class="flex justify-end mt-6 pt-6 border-t border-gray-100">
              <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveAccountInfo" :loading="isSavingAccount">
                Simpan Informasi
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Tab: Profil (Bio, Prestasi, Statistik, Riwayat Event) -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <div v-if="profileSections.length === 0"
            class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center py-12">
            <Icon icon="ph:identification-card" class="text-4xl text-gray-300 mx-auto mb-3" />
            <p class="text-sm text-gray-500 font-medium">Belum ada komponen profil. Tambahkan dari tab
              <strong>Pengaturan</strong>.
            </p>
          </div>
          <div v-for="section in profileSections" :key="section.type"
            class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
              <Icon :icon="section.icon" class="text-primary text-xl" />
              {{ section.label }}
            </h3>

            <div v-if="section.type === 'bio'" class="space-y-4">
              <BaseTextarea v-model="profile.bio" label="Deskripsi Diri"
                placeholder="Ceritakan sejarah panahan Anda, filosofi, atau informasi menarik lainnya..." :rows="5" />
              <p class="text-[10px] text-gray-400 font-medium italic">
                * Bio akan ditampilkan di halaman profil publik Anda untuk dilihat oleh klub dan penyelenggara event.
              </p>
            </div>

            <div v-if="section.type === 'achievements'" class="space-y-4">
              <BaseTextarea v-model="profile.achievements" label="Daftar Prestasi"
                placeholder="Contoh: Juara 1 Kejurnas 2023, Pemanah Terbaik Piala Walikota..." :rows="6" />
              <p class="text-[10px] text-gray-400 font-medium italic">
                * Masukkan prestasi Anda (satu per baris atau gunakan format teks bebas).
              </p>
            </div>

            <div v-if="section.type === 'event_history'" class="space-y-4">
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
          <div v-if="contactSections.length === 0"
            class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center py-12">
            <Icon icon="ph:phone" class="text-4xl text-gray-300 mx-auto mb-3" />
            <p class="text-sm text-gray-500 font-medium">Belum ada komponen kontak/sosial. Tambahkan dari tab
              <strong>Pengaturan</strong>.
            </p>
          </div>
          <div v-for="section in contactSections" :key="section.type"
            class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
              <Icon :icon="section.icon" class="text-primary text-xl" />
              {{ section.label }}
            </h3>

            <div v-if="section.type === 'contact'" class="space-y-4">
              <p class="text-sm text-gray-600">
                Informasi kontak akan diambil dari data profil Anda. Pastikan data sudah lengkap di halaman Settings.
              </p>
              <div class="p-4 bg-gray-50 rounded-xl space-y-2">
                <div v-if="user?.email" class="flex items-center gap-2">
                  <Icon icon="ph:envelope" class="text-primary" />
                  <span class="text-sm text-gray-700">{{ user.email }}</span>
                </div>
                <div v-if="user?.phone" class="flex items-center gap-2">
                  <Icon icon="ph:phone" class="text-primary" />
                  <span class="text-sm text-gray-700">{{ user.phone }}</span>
                </div>
                <NuxtLink to="/dashboard/settings"
                  class="inline-flex items-center gap-2 text-sm text-primary font-bold hover:underline">
                  <Icon icon="ph:pencil-simple" />
                  Edit Kontak di Settings
                </NuxtLink>
              </div>
            </div>

            <div v-if="section.type === 'social'" class="space-y-4">
              <p class="text-sm text-gray-600 mb-4">Tambahkan tautan media sosial Anda</p>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <Icon icon="ph:instagram-logo" class="text-primary text-xl" />
                  <input v-model="profile.socialLinks.instagram" type="text"
                    placeholder="https://instagram.com/username"
                    class="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div class="flex items-center gap-3">
                  <Icon icon="ph:facebook-logo" class="text-primary text-xl" />
                  <input v-model="profile.socialLinks.facebook" type="text" placeholder="https://facebook.com/username"
                    class="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div class="flex items-center gap-3">
                  <Icon icon="ph:youtube-logo" class="text-primary text-xl" />
                  <input v-model="profile.socialLinks.youtube" type="text" placeholder="https://youtube.com/@username"
                    class="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Peralatan & Galeri -->
        <div v-if="activeTab === 'equipment'" class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
              <Icon icon="ph:bow-arrow-bold" class="text-primary text-xl" />
              Peralatan Panahan
            </h3>
            <BaseTextarea v-model="profile.equipment" label="Peralatan Panahan"
              placeholder="Contoh: Recurve Bow - Hoyt, Arrows - Easton, Stabilizer - Beiter..." :rows="4" />
            <p class="text-[10px] text-gray-400 font-medium italic">
              * Daftar peralatan panahan yang Anda gunakan.
            </p>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
              <Icon icon="ph:images-bold" class="text-primary text-xl" />
              Galeri
            </h3>
            <p class="text-sm text-gray-600">
              Fitur galeri foto akan segera hadir. Anda dapat menambahkan foto-foto dari event dan latihan.
            </p>
            <div class="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
              <Icon icon="ph:images" class="text-4xl text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-500">Fitur galeri akan segera tersedia</p>
            </div>
          </div>
        </div>

        <!-- Tab: Settings (Page Configuration) -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 class="text-lg font-black text-navy mb-6 flex items-center gap-2">
              <Icon icon="ph:gear" class="text-black text-xl" />
              Pengaturan Halaman Profil
            </h3>
            <p class="text-sm text-gray-500 mb-6">
              Pilih komponen yang ingin ditampilkan di profil publik Anda. Seret untuk mengubah urutan.
            </p>

            <div class="space-y-4 mb-8">
              <div v-for="(section, index) in activeSections" :key="section.type"
                class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/30 transition-all cursor-move">
                <div class="flex items-center gap-3 flex-1">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon :icon="section.icon" class="text-black text-xl" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-navy">{{ section.label }}</h4>
                    <p class="text-xs text-gray-500">{{ section.description }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="section.isVisible" class="sr-only peer"
                        @change="updateSectionVisibility(section.type, section.isVisible)" />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                      </div>
                    </label>
                  </div>
                </div>
                <button @click="removeSection(section.type)"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Icon icon="ph:trash" class="text-lg" />
                </button>
              </div>
            </div>

            <div v-if="availableSections.length > 0">
              <h4 class="text-sm font-black text-navy mb-4 uppercase tracking-wider">Tambahkan Komponen</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button v-for="section in availableSections" :key="section.type" @click="addSection(section.type)"
                  class="flex items-center gap-3 p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon :icon="section.icon" class="text-black text-xl" />
                  </div>
                  <div class="flex-1">
                    <h5 class="font-bold text-navy text-sm">{{ section.label }}</h5>
                    <p class="text-xs text-gray-500">{{ section.description }}</p>
                  </div>
                  <Icon icon="ph:plus-circle" class="text-black text-xl" />
                </button>
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
            <p class="text-gray-400 text-xs font-bold uppercase tracking-tighter mt-1">{{ user?.username }}</p>

            <div v-if="profile.bio" class="mt-4 px-2">
              <p class="text-xs text-gray-500 italic line-clamp-3">"{{ profile.bio }}"</p>
            </div>

            <div class="w-full h-px bg-gray-50 my-6"></div>

            <div class="grid grid-cols-2 w-full gap-4">
              <div class="text-center">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Events</p>
                <p class="text-navy font-black">{{ userStats.totalEvents || 0 }}</p>
              </div>
              <div class="text-center border-l border-gray-50">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Best Score</p>
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
  equipment: '',
  socialLinks: {
    instagram: '',
    facebook: '',
    youtube: ''
  }
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
  { id: 'contact', label: 'Kontak & Sosial', icon: 'ph:phone-bold' },
  { id: 'equipment', label: 'Peralatan & Galeri', icon: 'ph:bow-arrow-bold' },
  { id: 'settings', label: 'Pengaturan', icon: 'ph:gear-bold' }
]

const activeSections = ref([])

const availableSections = computed(() => {
  const activeTypes = activeSections.value.map((s) => s.type)
  return allSections.filter((s) => !activeTypes.includes(s.type))
})

const profileSections = computed(() => {
  const types = ['bio', 'achievements', 'event_history']
  return activeSections.value.filter((s) => types.includes(s.type))
})

const contactSections = computed(() => {
  const types = ['contact', 'social']
  return activeSections.value.filter((s) => types.includes(s.type))
})

// Initialize sections
const initializeSections = () => {
  // Default sections: bio, achievements (removed stats)
  const defaultSections = ['bio', 'achievements']
  activeSections.value = allSections
    .filter((s) => defaultSections.includes(s.type))
    .map((s) => ({
      ...s,
      isVisible: s.defaultVisible
    }))
}

// Add section
const addSection = (sectionType) => {
  const section = allSections.find((s) => s.type === sectionType)
  if (section) {
    activeSections.value.push({
      ...section,
      isVisible: true
    })
  }
}

// Remove section
const removeSection = (sectionType) => {
  activeSections.value = activeSections.value.filter((s) => s.type !== sectionType)
}

// Update section visibility
const updateSectionVisibility = (sectionType, isVisible) => {
  const section = activeSections.value.find((s) => s.type === sectionType)
  if (section) {
    section.isVisible = isVisible
  }
}

// Initialize from user data
onMounted(async () => {
  initializeSections()
  
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
    profile.value.equipment = data.equipment || ''

    if (data.social_links) {
      if (typeof data.social_links === 'string') {
        try {
          profile.value.socialLinks = JSON.parse(data.social_links)
        } catch (e) { }
      } else {
        profile.value.socialLinks = { ...profile.value.socialLinks, ...data.social_links }
      }
    }

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
    
    if (response.page_settings) {
      try {
        const settings = typeof response.page_settings === 'string' 
          ? JSON.parse(response.page_settings) 
          : response.page_settings
        
        if (settings.sections) {
          activeSections.value = settings.sections
        }
      } catch (e) {
        console.error('Failed to parse page_settings:', e)
      }
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
      equipment: profile.value.equipment,
      social_links: profile.value.socialLinks,
      page_settings: JSON.stringify({
        sections: activeSections.value
      })
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
