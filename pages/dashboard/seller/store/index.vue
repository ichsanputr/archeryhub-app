<template>
  <div class="space-y-8">
    <!-- Store Summary Header -->
    <div class="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-navy text-white shadow-sm">
      <div class="absolute inset-0" :style="{ backgroundImage: 'var(--motif-pattern)', opacity: 'var(--motif-opacity, 0.2)' }">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="flex items-center gap-6">
          <div class="relative group">
            <div class="size-20 sm:size-24 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
               <img v-if="form.logo" :src="form.logo" class="w-full h-full object-cover" />
               <Icon v-else icon="ph:storefront-bold" class="text-primary text-4xl" />
            </div>
          </div>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight">{{ form.name || 'Nama Toko Belum Diatur' }}</h1>
              <span class="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black tracking-widest text-primary">Terverifikasi</span>
            </div>
            <div class="text-slate-300 text-xs sm:text-sm font-bold tracking-wide">Kelola data publik dan tampilan toko anda</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center gap-2 p-1.5 bg-gray-50 rounded-3xl border border-gray-100 w-fit mx-auto sm:mx-0">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" 
        class="px-6 py-3 rounded-2xl text-[11px] font-black tracking-[0.2em] transition-all duration-300"
        :class="activeTab === tab.id ? 'bg-navy text-white shadow-lg' : 'text-gray-400 hover:text-navy hover:bg-white'">
        {{ tab.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
      <!-- Main Form -->
      <div class="xl:col-span-3 space-y-8">
        <div v-if="activeTab === 'basic'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <!-- Visual Branding Section -->
          <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div class="p-8 border-b border-gray-50 flex items-center gap-3">
              <div class="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon icon="ph:image-bold" class="text-primary text-xl" />
              </div>
              <h2 class="text-lg font-black text-navy tracking-widest">Identitas Visual</h2>
            </div>
            <div class="p-8 space-y-8">
              <!-- Banner Selection -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-black text-navy">Banner Toko</div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase">Latar belakang profil toko anda</div>
                  </div>
                  <BaseButton @click="openMedia('banner')" variant="white" size="sm" icon="ph:pencil-simple-bold"
                    class="h-10 px-5 !rounded-xl font-black text-[10px] tracking-widest border-gray-200">
                    Ganti Banner
                  </BaseButton>
                </div>
                <div class="relative h-48 sm:h-64 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group transition-all hover:border-primary/30">
                  <img v-if="form.banner" :src="form.banner" class="w-full h-full object-cover" />
                  <div v-else class="text-center">
                    <Icon icon="ph:image-square-bold" class="text-4xl text-gray-200 mx-auto mb-2" />
                    <div class="text-[10px] font-bold text-gray-300">Format 16:9 direkomendasikan</div>
                  </div>
                </div>
              </div>

              <!-- Logo Selection -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                <div class="flex items-start gap-6">
                  <div class="size-24 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <img v-if="form.logo" :src="form.logo" class="w-full h-full object-cover" />
                    <Icon v-else icon="ph:storefront-bold" class="text-3xl text-gray-200" />
                  </div>
                  <div class="space-y-3 pt-2">
                    <div>
                      <div class="text-sm font-black text-navy">Logo Toko</div>
                      <div class="text-[10px] text-gray-400 font-bold">Format persegi (1:1)</div>
                    </div>
                    <BaseButton @click="openMedia('logo')" variant="white" size="sm" icon="ph:camera-bold"
                      class="h-10 px-5 !rounded-xl font-black text-[10px] tracking-widest border-gray-200">
                      Upload Logo
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Store Information Section -->
          <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
             <div class="p-8 border-b border-gray-50 flex items-center gap-3">
                <div class="size-10 rounded-2xl bg-navy/5 flex items-center justify-center">
                  <Icon icon="ph:identification-card-bold" class="text-navy text-xl" />
                </div>
                <h2 class="text-lg font-black text-navy tracking-widest">Informasi Profil</h2>
              </div>
            <div class="p-8 space-y-6">
              <BaseInput v-model="form.name" label="Nama Toko" placeholder="Nama brand atau toko anda" required class="!rounded-2xl" />
              <BaseInput v-model="form.username" label="Username / Link Toko" placeholder="Contoh: archeryhub.id/toko-saya" required class="!rounded-2xl" prefix="archeryhub.id/" />
              <BaseTextarea v-model="form.description" label="Deskripsi Toko" placeholder="Ceritakan tentang toko anda..." rows="4" class="!rounded-2xl" />
            </div>
          </div>
        </div>

        <!-- Contact & Social Section -->
        <div v-if="activeTab === 'contact'" class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="p-8 border-b border-gray-50 flex items-center gap-3">
                <div class="size-10 rounded-2xl bg-green-50 flex items-center justify-center">
                  <Icon icon="ph:whatsapp-logo-bold" class="text-green-600 text-xl" />
                </div>
                <h2 class="text-lg font-black text-navy tracking-widest">Kontak & Sosial</h2>
              </div>
          <div class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.email" label="Email Bisnis" placeholder="email@toko.com" class="!rounded-2xl" icon="ph:envelope-simple-bold" />
              <BaseInput v-model="form.phone" label="Nomor WhatsApp" placeholder="0812xxxx" class="!rounded-2xl" icon="ph:whatsapp-logo-bold" />
            </div>
          </div>
        </div>
      </div>

      <!-- Side Actions -->
      <div class="xl:col-span-1">
        <div class="sticky top-24 space-y-4">
          <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
            <div class="flex items-center gap-3 mb-2">
               <div class="size-2 bg-primary rounded-full animate-pulse"></div>
               <div class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Tindakan</div>
            </div>
            <BaseButton @click="handleUpdate" :loading="loading" block variant="primary" size="lg"
              class="h-14 !rounded-2xl font-black tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20">
              Simpan Perubahan
            </BaseButton>
            <BaseButton block variant="white" size="lg"
              class="h-14 !rounded-2xl font-black tracking-[0.2em] text-[11px] border-gray-100 text-gray-400">
              Lihat Toko Saya
            </BaseButton>
          </div>

          <div class="bg-navy/5 rounded-[2rem] p-6 border border-navy/5">
             <div class="flex items-center gap-2 mb-3">
               <Icon icon="ph:info-bold" class="text-navy/40" />
               <div class="text-[9px] font-black text-navy/40 tracking-widest uppercase">Tips Optimasi</div>
             </div>
             <div class="text-xs text-navy/60 font-medium leading-relaxed">Gunakan banner dengan resolusi tinggi (1920x1080) untuk memberikan kesan profesional pada pembeli.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Library Modal -->
    <MediaLibrary v-model:show="media.show" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { onMounted, reactive, ref } from 'vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Pengaturan Toko - Dashboard Seller' })

const api = useApi()
const toast = useToast()

const activeTab = ref('basic')
const tabs = [
  { id: 'basic', label: 'Profil Dasar' },
  { id: 'contact', label: 'Kontak & Sosial' }
]

const loading = ref(false)
const media = reactive({
  show: false,
  target: '' // 'logo' or 'banner'
})

const form = reactive({
  name: '',
  username: '',
  description: '',
  logo: '',
  banner: '',
  email: '',
  phone: ''
})

const fetchStoreData = async () => {
  try {
    const res = await api.get('/sellers/profile')
    const data = res?.data || res
    if (data) {
      form.name = data.name || ''
      form.username = data.username || ''
      form.description = data.description || ''
      form.logo = data.logo || ''
      form.banner = data.banner || ''
      form.email = data.email || ''
      form.phone = data.phone || ''
    }
  } catch (error) {
    console.error('Failed to fetch store profile:', error)
  }
}

const openMedia = (target) => {
  media.target = target
  media.show = true
}

const handleMediaSelect = (url) => {
  if (media.target === 'logo') form.logo = url
  if (media.target === 'banner') form.banner = url
  media.show = false
}

const handleUpdate = async () => {
  loading.value = true
  try {
    await api.put('/sellers/profile', form)
    toast.success('Pengaturan toko berhasil diperbarui')
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Gagal memperbarui pengaturan')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStoreData()
})
</script>